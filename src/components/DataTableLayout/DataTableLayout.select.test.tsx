import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { DataTableLayout } from "./DataTableLayout";

type Row = { id: string; name: string };

const rows: Row[] = [
  { id: "1", name: "Bitcoin" },
  { id: "2", name: "Ethereum" },
];

function setup() {
  const toggleAll = vi.fn();
  const toggleOne = vi.fn();
  const columns = [
    {
      key: "select",
      header: (
        <input type="checkbox" aria-label="Select all" onChange={toggleAll} />
      ),
      render: (row: Row) => (
        <input
          type="checkbox"
          aria-label={`Select ${row.name}`}
          onChange={() => toggleOne(row.id)}
        />
      ),
    },
    { key: "name", header: "Asset" },
  ];
  render(
    <DataTableLayout<Row>
      data={rows}
      columns={columns}
      rowKey={(r) => r.id}
      itemsPerPage={10}
      totalCount={rows.length}
    />,
  );
  return { toggleAll, toggleOne };
}

describe("DataTableLayout mobile cards with a select column", () => {
  it("renders exactly one checkbox per card (the row's own), no select-all", () => {
    setup();
    const cards = screen.getAllByTestId("mobile-row-select");
    expect(cards).toHaveLength(rows.length);
    // Only the desktop header has a select-all; cards must not repeat it.
    expect(screen.getAllByLabelText("Select all")).toHaveLength(1);
    cards.forEach((c) =>
      expect(within(c).getAllByRole("checkbox")).toHaveLength(1),
    );
  });

  it("card checkbox selects only that row", () => {
    const { toggleAll, toggleOne } = setup();
    const card = screen.getAllByTestId("mobile-row-select")[1];
    fireEvent.click(within(card).getByRole("checkbox"));
    expect(toggleOne).toHaveBeenCalledWith("2");
    expect(toggleAll).not.toHaveBeenCalled();
  });
});
