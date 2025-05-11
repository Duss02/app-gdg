# Accessibility Viewer

This application is designed to improve web accessibility by rendering websites in a way optimized for users with disabilities such as dyslexia, color blindness, or hearing impairments.

## Setup
Make sure that the server is running in localhost:8000 as it will be used to do the agentic and computer use work

## Features

* **Personalized onboarding**: collects information about the user's accessibility needs (dyslexia, color blindness, deafness, etc.)
* **Preference saving**: stores the user's configuration in localStorage
* **Optimized rendering**: adapts the interface based on the user's needs
* **External actions intake**: displays available actions on a target page in an accessible way

## How to Use the Application

1. **Initial Setup**: navigate to `/onboarding` to configure your accessibility preferences
2. **Viewing a Website**: visit the application with an `actions` parameter in the URL containing information about elements on the target website

### Action Data Format

The application accepts actions as a URL-encoded parameter. Each action is represented by one of the following JSON formats, and elements can be of any of these types:

#### Click Element
```json
{
  "id": "string or null if not available",
  "label": "text displayed on the element",
  "description": "short description of what this element does",
  "importance": "number indicating the importance of the element",
  "type": "click"
}
```

#### Select Element
```json
{
  "id": "string or null if not available",
  "label": "text associated with this selection element",
  "description": "what this selection controls or influences",
  "importance": "number indicating the importance of the element",
  "type": "select",
  "options": ["option1", "option2", "option3"]
}
```

#### Input Element
```json
{
  "id": "string or null if not available",
  "label": "label text of the field",
  "description": "what information this field collects",
  "importance": "number indicating the importance of the element",
  "type": "input",
  "placeholder": "placeholder text if present, otherwise empty string",
  "inputType": "text, number, email, or password"
}
```

#### Form Element
```json
{
  "id": "string or null if not available",
  "label": "text displayed on the form element",
  "description": "short description of what this form does",
  "importance": "number indicating the importance of the form",
  "type": "form",
  "submitButton": {
    "id": "string or null if not available",
    "label": "text displayed on the submit button"
  },
  "inputs": [
    {
      "id": "string or null if not available",
      "label": "label text of the field",
      "description": "what information this field collects",
      "placeholder": "placeholder text if present, otherwise empty string",
      "inputType": "text, number, email, or password",
      "required": "boolean indicating if the field is required"
    }
  ]
}
```

## Test Page

To test the application's functionality, visit the `/test` page, which contains sample data and a link to test the optimized rendering.

## Technologies Used

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS

## Local Development

To start the application in development mode:

```bash
pnpm dev
```

To build the application for production:

```bash
pnpm build
```

To start the application in production mode:

```bash
pnpm start
```
