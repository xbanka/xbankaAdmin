import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NoRoleChangeCell, RoleChangeCell } from "./role-change-cell";

describe("RoleChangeCell", () => {
  it("renders from and to roles inline without the modal labels", () => {
    render(<RoleChangeCell from="Manager" to="Admin" />);

    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.queryByText("Current Role")).not.toBeInTheDocument();
    expect(screen.queryByText("New Role")).not.toBeInTheDocument();
  });

  it("shows the sub status line when provided", () => {
    render(
      <RoleChangeCell
        from="Manager"
        to="Admin"
        subStatus="Pending confirmation"
      />,
    );

    expect(screen.getByText("Pending confirmation")).toBeInTheDocument();
  });

  it("omits the sub status line when not provided", () => {
    render(<RoleChangeCell from="Manager" to="Admin" />);

    expect(screen.queryByText("Pending confirmation")).not.toBeInTheDocument();
  });
});

describe("NoRoleChangeCell", () => {
  it("renders the empty placeholder", () => {
    render(<NoRoleChangeCell />);

    expect(screen.getByText("----")).toBeInTheDocument();
  });
});
