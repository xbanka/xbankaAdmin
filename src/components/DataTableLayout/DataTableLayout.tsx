"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableLayoutProps<T> {
  data: T[]
  columns: Column<T>[]
  rowKey: (item: T) => string | number
  emptyMessage?: string
  itemsPerPage?: number
  totalCount?: number
  onPageChange?: (page: number) => void
  currentPage?: number
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
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
  const [localPage, setLocalPage] = useState(1)
  const page = currentPage ?? localPage
  const totalItems = totalCount ?? data?.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = !onPageChange
    ? data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : data

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    if (onPageChange) {
      onPageChange(newPage)
    } else {
      setLocalPage(newPage)
    }
  }

  const generatePageButtons = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages)
      }
    }
    return pages
  }

  return (
    <div className="w-full">
      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            {columns.map((col) => (
              <TableHead key={col.key as string} className={`font-medium text-gray-600 ${col.className ?? ""}`}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Loading State */}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6 text-gray-500">
                Loading...
              </TableCell>
            </TableRow>
          )}

          {/* Error State */}
          {!isLoading && isError && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6 text-red-500">
                {errorMessage}
              </TableCell>
            </TableRow>
          )}

          {!isLoading && !isError && paginatedData?.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gray-500 py-6">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          { !isLoading &&
            !isError && (
            paginatedData?.map((item) => (
              <TableRow key={rowKey(item)} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <TableCell key={col.key as string}>
                    {col.render ? col.render(item) : (item as never)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t mt-2">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
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
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
