"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: any) => React.ReactNode;
}

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  placeholder: string;
  options: FilterOption[];
}

interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (row: any) => void;
  className?: string;
}

interface TabFilter {
  key: string;
  label: string;
  value: string;
}

interface DataTableProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: Column[];
  searchKeys: string[];
  filters?: Filter[];
  actions?: ActionItem[];
  headerActions?: React.ReactNode;
  getBadgeColor?: (status: string) => string;
  tabFilters?: TabFilter[];
  tabFilterKey?: string;
}

export function DataTable({
  title,
  data,
  columns,
  searchKeys,
  filters = [],
  actions = [],
  headerActions,
  getBadgeColor,
  tabFilters = [],
  tabFilterKey = "",
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState(
    tabFilters.length > 0 ? tabFilters[0].value : "all"
  );

  // Initialize filter values
  const initializedFilters = filters.reduce((acc, filter) => {
    if (!acc[filter.key]) {
      acc[filter.key] = "all";
    }
    return acc;
  }, filterValues);

  const filteredData = data.filter((item) => {
    // Search filter
    const matchesSearch = searchKeys.some((key) =>
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tab filter
    const matchesTabFilter =
      !tabFilterKey ||
      activeTab === "all" ||
      item[tabFilterKey]?.toLowerCase() === activeTab.toLowerCase();

    // Other filters
    const matchesFilters = filters.every((filter) => {
      const filterValue = initializedFilters[filter.key];
      if (filterValue === "all") return true;
      return item[filter.key]?.toLowerCase() === filterValue;
    });

    return matchesSearch && matchesTabFilter && matchesFilters;
  });

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCellContent = (column: Column, row: any) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    // Default badge rendering for status-like fields
    if (column.key.toLowerCase().includes("status") && getBadgeColor) {
      return <Badge className={getBadgeColor(value)}>{value}</Badge>;
    }

    return value;
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          {tabFilters.length > 0 && (
            <div className="flex items-center gap-2">
              {tabFilters.map((tab) => (
                <Button
                  key={tab.value}
                  variant={activeTab === tab.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.value)}
                  className={activeTab === tab.value ? "" : "bg-transparent"}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            {/* <CardTitle className="text-deep-blue">{title}</CardTitle> */}
            {headerActions}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={initializedFilters[filter.key]}
              onValueChange={(value) => handleFilterChange(filter.key, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {actions.length > 0 && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={row.id || index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={column.key === "id" ? "font-medium" : ""}
                  >
                    {renderCellContent(column, row)}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action, actionIndex) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={action.className}
                          >
                            {action.icon && (
                              <span className="mr-2">{action.icon}</span>
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
