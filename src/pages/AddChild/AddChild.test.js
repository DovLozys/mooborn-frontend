import { getByTestId, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddChild from ".";

//test the name input
test("pass a name to input field for name", () => {
  render(<AddChild />);
  const inputElement = screen.getByTestId("inputChildName");
  userEvent.type(inputElement, "Asani");
  expect(screen.getByTestId("inputChildName")).toHaveValue("Asani");
});

//test the allergy input field
test("pass an allergy to input field for allergies", () => {
  render(<AddChild />);
  const inputElement = screen.getByTestId("inputChildAllergies");
  userEvent.type(inputElement, "eggs, cows milk, peanuts");
  expect(screen.getByTestId("inputChildAllergies")).toHaveValue(
    "eggs, cows milk, peanuts"
  );
});

//test the weight input field (lb)
test("pass an weight to input field for weight(lbs)", () => {
  render(<AddChild />);
  const inputElement = screen.getByTestId("weightPounds");
  userEvent.type(inputElement, "1");
  expect(inputElement.value).toBe("1");
});

//test the checkboxes
//breastmilk checkbox
test("toggle element by selecting breastmilk checkbox", () => {
  render(<AddChild />);
  const checkboxElement = screen.getByTestId("breastmilkCheckBox");
  // Execute the click event of the checkbox
  userEvent.click(checkboxElement);
  expect(checkboxElement).toBeChecked();
  // Execute the click event again
  userEvent.click(checkboxElement);
  expect(checkboxElement).not.toBeChecked();
});

//formula checkbox
test("toggle element by selecting formula checkbox", () => {
  render(<AddChild />);
  const checkboxElement = screen.getByTestId("formulaCheckbox ");
  // Execute the click event of the checkbox
  userEvent.click(checkboxElement);
  expect(checkboxElement).toBeChecked();
  // Execute the click event again
  userEvent.click(checkboxElement);
  expect(checkboxElement).not.toBeChecked();
});

//solids checkbox
test("toggle element by selecting solids checkbox", () => {
  render(<AddChild />);
  const checkboxElement = screen.getByTestId("solidsCheckbox");
  // Execute the click event of the checkbox
  userEvent.click(checkboxElement);
  expect(checkboxElement).toBeChecked();
  // Execute the click event again
  userEvent.click(checkboxElement);
  expect(checkboxElement).not.toBeChecked();
});

//test sex dropdown
//test male
test("should allow user to change babys sex to male", () => {
  render(<AddChild />);
  userEvent.selectOptions(
    screen.getByTestId("sexOptions"),
    screen.getByText("Male")
  );
  expect(screen.getByText("Male").selected).toBe(true);
});

// //test female
test("should allow user to change babys sex to female", () => {
  render(<AddChild />);
  userEvent.selectOptions(
    screen.getByTestId("sexOptions"),
    screen.getByText("Female")
  );
  expect(screen.getByText("Female").selected).toBe(true);
});

// //test other
test("should allow user to change babys sex to other", () => {
  render(<AddChild />);
  userEvent.selectOptions(
    screen.getByTestId("sexOptions"),
    screen.getByText("Other")
  );
  expect(screen.getByText("Other").selected).toBe(true);
});
