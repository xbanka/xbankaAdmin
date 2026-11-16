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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const SKELETON_ROWS = 6;

interface Column<T> {
  key: keyof T | string;
  header: React.ReactNode;
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
  className?: string;
  /**
   * Narrowest the desktop table may get before it scrolls sideways inside
   * its box (px). Defaults to a width derived from the column count; pass
   * `false` to let it shrink to fit its container instead.
   */
  minWidth?: number | false;
}

// Rough comfortable width per column, and the floor for small tables.
const COLUMN_MIN_WIDTH = 140;
const SELECT_COLUMN_WIDTH = 50;
const TABLE_MIN_WIDTH = 640;

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
  className,
  minWidth,
}: DataTableLayoutProps<T>) {
  const [localPage, setLocalPage] = useState(1);
  const page = currentPage ?? localPage;
  const totalItems = totalCount ?? data?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = !onPageChange
    ? data?.slice((page - 1) * itemsPerPage, page * itemsPerPage)
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
  // Row-selection column: on mobile its header (a select-all checkbox) must not
  // repeat on every card, so we render only the row checkbox in the card header.
  const selectColumn = columns.find((col) => col.key === "select");

  // Columns keep a readable width; once the container is narrower than
  // this, the table scrolls horizontally instead of truncating every cell.
  const tableMinWidth =
    minWidth === false
      ? undefined
      : minWidth ??
        Math.max(
          TABLE_MIN_WIDTH,
          columns.reduce(
            (sum, col) =>
              sum + (col.key === "select" ? SELECT_COLUMN_WIDTH : COLUMN_MIN_WIDTH),
            0
          )
        );

  return (
    <div
      className={cn(
        "w-full max-w-full border border-border rounded-[8px]",
        className
      )}
    >
      {/* The Table primitive wraps itself in an overflow-x-auto container,
          so only the table scrolls sideways, never the page. */}
      <div className="hidden md:block w-full min-w-0 overflow-hidden rounded-[8px]">
        <Table
          style={tableMinWidth ? { minWidth: tableMinWidth } : undefined}
          className={cn("w-full table-fixed", isLoading || isError ? "pointer-events-none" : "")}
        >
          <TableHeader>
            <TableRow className="bg-card-secondary">
              {columns.map((col) => (
                <TableHead
                  key={col.key as string}
                  className={`truncate font-medium py-[8px] px-[20px] text-[12px] leading-[16px] text-[#606368] ${
                    col.className ?? ""
                  }`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Rows rise in one after another once data replaces the
              skeleton (and again whenever a new page of rows arrives). */}
          <TableBody className={cn(!isLoading && "stagger")}>
            {/* Loading State */}
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell
                      key={col.key as string}
                      className="py-[19px] px-[20px]"
                    >
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

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
                      className={cn(
                        "py-[19px] px-[20px] text-left whitespace-nowrap overflow-hidden text-ellipsis",
                        col.className
                      )}
                      key={col.key as string}
                    >
                      {col.render
                        ? col.render(item)
                        : (item as never)[col.key]}
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
          <div className="space-y-4 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E7EB] rounded-[10px] p-4 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
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
          <div className="stagger space-y-4 p-4">
            {paginatedData?.map((item) => (
              <div
                key={rowKey(item)}
                className="bg-white border border-[#E5E7EB] rounded-[10px] p-4 shadow-sm space-y-3"
              >
                {/* Main top row */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {selectColumn?.render && (
                      <div data-testid="mobile-row-select">
                        {selectColumn.render(item)}
                      </div>
                    )}
                  <div className="flex flex-col">
                    <span className="text-[12px] text-[#606368] font-medium">
                      Request ID
                    </span>
                    <span className="text-[15px] font-[600] text-[#111827]">
                      {(item as any).requestId ?? (item as any).id}
                    </span>
                  </div>
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
                        col.key !== "select" &&
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
          <p className="font-[500] text-[12px] leading-[16px] text-[#606368]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            {generatePageButtons().map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <Button
                  key={i}
                  variant={p === page ? "pagination" : "outline"}
                  size="sm"
                  className={`${ p !== page && "border-none"} "w-6 h-6 p-2 rounded-[6px] font-[400] text-[12px] leading-4" `}
                  onClick={() => handlePageChange(p as number)}
                >
                  {p}
                </Button>
              )
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant={page === totalPages ? "outline" : "ghost"}
              className="border border-[#E5E3E3]"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant={page === totalPages ? "outline" : "ghost"}
              className="border border-[#E5E3E3]"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
