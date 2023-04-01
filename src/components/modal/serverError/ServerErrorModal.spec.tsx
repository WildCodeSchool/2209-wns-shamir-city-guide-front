import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ServerErrorModal from "./ServerErrorModal";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../../features/store";

describe("Logout modal display", () => {
    it("should display the error server modal and test the interaction on it", async () => { 
        // const error = jest.fn();
        const handleLogoutModalClose = jest.fn();
    
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <ServerErrorModal
                        error={undefined} 
                        onModalClose={handleLogoutModalClose} 
                    />
                </BrowserRouter>
            </Provider>
        );
        
          // Sélection de l'élément SVG par son attribut data-testid
          const svgElement = screen.getByTestId('mon-svg');

          // Simulation du clic sur l'élément SVG
          fireEvent.click(svgElement);
        
          // Vérification que l'élément SVG a bien été cliqué et la fonction handleLogoutModalClose appelée
          expect(handleLogoutModalClose.mock.calls.length).toBe(1);
    });

});
