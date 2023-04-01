import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutModal from "./LogoutModal";

describe("Logout modal display", () => {
    it("should display the modal for the user deconnexion and test the interaction on it", async () => { 
      const handleLogout = jest.fn();
      const handleLogoutModalClose = jest.fn();
  
      render(<LogoutModal
        onLogout={handleLogout} 
        onLogoutModalClose={handleLogoutModalClose} 
      />);
  
      await userEvent.click(screen.getByText(/Oui/i));
      expect(handleLogout.mock.calls.length).toBe(1);
  
      await userEvent.click(screen.getByText(/Non/i));
      expect(handleLogoutModalClose.mock.calls.length).toBe(1);
  
      expect(screen.getByText(/Oui/i)).toBeInTheDocument();
    });
  });