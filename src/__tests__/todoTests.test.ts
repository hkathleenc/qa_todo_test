import {
  WebDriver,
  By,
  Builder,
  Capabilities,
  until,
} from "selenium-webdriver";
import { addConsoleHandler } from "selenium-webdriver/lib/logging";

const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder().withCapabilities(Capabilities.chrome()).build();

class TodoPage {
  driver: WebDriver;
  url: string = "https://devmountain.github.io/qa_todos/";
  // "What needs to be done?" element
  todoInput: By = By.className("new-todo");
  // All the todo elements
  todos: By = By.css("li.todo");
  todoLabel: By = By.css("label");

  // POM constructor
  constructor(driver:WebDriver) {
    this.driver = driver;
  }
  // Navigate to the website
  async navigate() {
    await driver.get(this.url);
    await driver.wait(until.elementLocated(this.todoInput));
  }
  // Add a new todo element
  async addTodo(title: string) {
    // Function accepts a string argument that will be the title of the new
    // todo element.
    await driver.findElement(this.todoInput).sendKeys(title);
    await driver.findElement(this.todoInput).sendKeys('\n');
  }
  // Find the number of all todo elements
  async getNumTodos() {
    let myTodos = await driver.findElements(this.todos);
    return myTodos.length;
  }
}

// Create a new TodoPage object
let page : TodoPage = new TodoPage(driver);

describe("the todo app", () => {
  it("Can navigate to the correct page", async () => {
    // Navigate to the page
   page.navigate();
   // Add new element
   await driver.findElement(page.todoInput).sendKeys("Test To-Do\n");
   let myTodos = await driver.findElements(page.todos);
   let myTodo = await myTodos.filter(async (todo) => {
     (await (await todo.findElement(page.todoLabel)).getText()) == "Test To-Do";
   });
   // 5. We should only have the one
   expect(myTodo.length).toEqual(1);
  });

 
  afterAll(async () => {
    await page.driver.quit();
  });
  
});

/*
**NOTE: NOT implemented**
 List of elements:
 1. What Needs to be Done?
 
 <input class="new-todo" type="text" placeholder="What needs to be done?" value=""> 

 2. Todo title
*/

/*
1. Test that todo item title displayed is the same as the text
  that the user entered

  Steps:
  Navigate to page
  Click on What Needs to be Done Button
  Input text "Todo Title"
  Press Enter
  Check value in title element: matches "Todo Title"


2. Check that number in count of active items increments after a 
    new todo is created.

   *This tests assumes that when the test is begun, there are zero todo items in the list.

  Steps:
  Navigate to page
  Create new todo item:
    Click on What Needs to be Done Button
    Input text "Todo Title"
    Press Enter
  Check that value in text displayed at bottom left of main element
  contains "1 items left"

3. Check that number in count of active items decrements after a todo is completed 
   and completed items are cleared

   *This test assumes that when the test is begun, there are zero todo items in the list. 

  Steps:
  Navigate to page
  Create new todo item:
    Click on What Needs to be Done Button
    Input text "Todo Title"
    Press Enter
  Click button at left of title of newly todo element, marking it completed.
  Click "Clear completed" button 
  Check that value in text displayed at bottom left of main element
  contains "0 items left"



  Methods:
    Navigate to page
    Create new todo item (accepts title as argument)
    Compare the value in the number-of-active-items element (accepts desired value as argument)
    Press Enter

*/