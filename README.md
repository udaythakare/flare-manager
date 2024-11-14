# Task Manager (To-Do) App

A simple and efficient task management application built with ReactJS. This app allows users to add, delete, and mark tasks as completed, as well as search tasks with an advanced scoring-based search algorithm. It's designed to make organizing daily tasks easy and productive, with tasks stored in local storage for persistent access.

![image](https://github.com/user-attachments/assets/d97134cc-e0ba-42f6-bc00-8c899e698a57)


## Features

- **Add Tasks**: Create new tasks with title, description, category, and priority.
- **Delete Tasks**: Remove tasks that are no longer needed.
- **Complete Tasks**: Mark tasks as completed to keep track of what’s done.
- **Advanced Search Functionality**: Search tasks based on title, description, category, and priority using a custom scoring algorithm.
- **Random Task Generation**: Generate random tasks from a predefined list in `randomTasks.json`.
- **Persistent Storage**: Tasks are stored in local storage, so they remain accessible even after refreshing the page.

## Search Algorithm

The search feature includes a weighted scoring algorithm to rank tasks based on how well they match the search input. Here's how the search works:

1. **Field Weights**: Each field (title, description, category, and priority) has a different weight, prioritizing the title and description.
2. **Case-Insensitive Matching**: The search is case-insensitive.
3. **Exact and Partial Matching**: Exact matches get the highest score, partial matches get a lower score, and individual word matches are also considered.
4. **Sorting**: Tasks with the highest match scores appear first in the search results.

### Code Snippet

The search function, `handleSearchTasks`, calculates and sorts tasks based on the relevance to the search query:

```javascript
const handleSearchTasks = (searchParam) => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  if (!searchParam?.trim()) {
    setAllTasks(tasks);
    return;
  }
  const searchTerm = searchParam.toLowerCase();
  const weights = { title: 3, description: 2, category: 2, priority: 1 };
  const scoredTasks = tasks.map(task => {
    let score = 0;
    const calculateFieldScore = (fieldValue, weight) => {
      if (!fieldValue) return 0;
      const value = fieldValue.toLowerCase();
      if (value === searchTerm) return weight * 2;
      if (value.includes(searchTerm)) return weight;
      const searchWords = searchTerm.split(' ');
      const fieldWords = value.split(' ');
      return searchWords.reduce((acc, searchWord) => {
        return acc + (fieldWords.some(fieldWord => fieldWord.includes(searchWord)) ? 0.5 : 0);
      }, 0) * weight;
    };
    score += calculateFieldScore(task.title, weights.title);
    score += calculateFieldScore(task.description, weights.description);
    score += calculateFieldScore(task.category, weights.category);
    score += calculateFieldScore(task.priority, weights.priority);
    return { ...task, score };
  });
  const filteredTasks = scoredTasks.filter(task => task.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ score, ...task }) => task);
  setAllTasks(filteredTasks);
};
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm (v6+ recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/udaythakare/flare-manager.git
   ```

2. Navigate into the project directory:

   ```bash
   cd flare-manager
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Adding Random Tasks

To add random tasks, the app reads from a `randomTasks.json` file. These tasks can be added to your list to quickly populate your task manager.

## Technologies Used

- **ReactJS**: Frontend framework for building user interfaces.
- **CSS/Tailwind CSS**: For responsive styling.
- **Local Storage**: For task persistence.
