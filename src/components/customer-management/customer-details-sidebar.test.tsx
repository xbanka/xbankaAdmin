import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DetailField } from "./detail-field";
import { CustomerDetailsSkeleton } from "./customer-details-skeleton";

describe("DetailField", () => {
  it.each([null, undefined, "", "  "])("shows N/A for %p", (value) => {
    render(<DetailField label="Phone number" value={value} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.queryByText("—")).not.toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
  });

  it("shows the value when present", () => {
    render(<DetailField label="Phone number" value="+2348012345678" />);
    expect(screen.getByText("+2348012345678")).toBeInTheDocument();
  });
});

describe("CustomerDetailsSkeleton", () => {
  it("renders header, one placeholder per tab, and the profile field grid", () => {
    const { container } = render(<CustomerDetailsSkeleton />);
    expect(screen.getByTestId("customer-details-skeleton")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    // avatar + name + tier + uid + email = 5, tabs = 4, card title = 1, 9 fields x2 = 18, address x2 = 2
    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBe(30);
  });

  it("keeps the close button usable while loading", () => {
    const onClose = vi.fn();
    render(<CustomerDetailsSkeleton onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
