/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import LoaderSpinner from "../ui/loaderSpinner";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hiddenOnMobile?: boolean;
}

interface DataTableLayoutProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  emptyMessage?: string;
  itemsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export function DataTableLayout<T>({
  data,
  columns,
  rowKey,
  emptyMessage = "No data available.",
  itemsPerPage = 10,
  totalCount,
  onPageChange,
  currentPage,
  isLoading = false,
  isError = false,
  errorMessage = "Failed to load data.",
}: DataTableLayoutProps<T>) {
  const [localPage, setLocalPage] = useState(1);
  const page = currentPage ?? localPage;
  const totalItems = totalCount ?? data?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = !onPageChange
    ? data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : data;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  };

  const generatePageButtons = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Filter columns for mobile (show only non-hidden columns)
  const visibleColumns = columns.filter((col) => !col.hiddenOnMobile);

  return (
    <div className="w-full border border-[#E5E7EB] rounded-[8px] overflow-hidden">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block max-w-full overflow-x-auto">
        <Table className="min-w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-[#FAFAFA]">
              {columns.map((col) => (
                <TableHead
                  key={col.key as string}
                  className={`font-medium py-[8px] px-[20px] text-[12px] leading-[16px] text-[#606368] ${
                    col.className ?? ""
                  }`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading State */}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  <LoaderSpinner />
                </TableCell>
              </TableRow>
            )}

            {/* Error State */}
            {!isLoading && isError && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6 text-red-500"
                >
                  {errorMessage}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && paginatedData?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-[#111827] text-[14px] font-[500] leading-[18px] py-6"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              paginatedData?.map((item) => (
                <TableRow
                  key={rowKey(item)}
                  className="hover:bg-gray-50 text-left text-[#111827] text-[14px] font-[500] leading-[18px]"
                >
                  {columns.map((col) => (
                    <TableCell
                      className="py-[19px] px-[20px] text-left"
                      key={col.key as string}
                    >
                      {col.render ? col.render(item) : (item as never)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE CARD VIEW */}
      {/* MOBILE CARD VIEW */}
      <div className="md:hidden">
        {isLoading && (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        )}

        {!isLoading && isError && (
          <div className="p-6 text-center text-red-500">{errorMessage}</div>
        )}

        {!isLoading && !isError && paginatedData?.length === 0 && (
          <div className="p-6 text-center text-[#111827] text-[14px] font-[500] leading-[18px]">
            {emptyMessage}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-4 p-4">
            {paginatedData?.map((item) => (
              <div
                key={rowKey(item)}
                className="bg-white border border-[#E5E7EB] rounded-[10px] p-4 shadow-sm space-y-3"
              >
                {/* Main top row */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-[#606368] font-medium">
                      Request ID
                    </span>
                    <span className="text-[15px] font-[600] text-[#111827]">
                      {(item as any).requestId ?? (item as any).id}
                    </span>
                  </div>

                  {/* Status (rendered with your existing badge colors) */}
                  <div>
                    {columns.find((c) => c.key === "status")?.render?.(item)}
                  </div>
                </div>

                {/* Other fields */}
                <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                  {visibleColumns
                    .filter(
                      (col) =>
                        col.key !== "status" &&
                        col.key !== "actions" &&
                        col.key !== "requestId"
                    )
                    .map((col) => (
                      <div
                        key={col.key as string}
                        className="flex justify-between items-start"
                      >
                        <span className="text-[12px] text-[#606368] font-medium">
                          {col.header}
                        </span>
                        <span className="text-[14px] font-[500] text-[#111827] text-right">
                          {col.render
                            ? col.render(item)
                            : (item as any)[col.key]}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Actions Button */}
                <div className="pt-2">
                  {columns.find((c) => c.key === "actions")?.render?.(item)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t mt-2">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {generatePageButtons().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <Button
                    key={i}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => handlePageChange(p as number)}
                  >
                    {p}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
