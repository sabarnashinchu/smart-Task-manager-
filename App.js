import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Snackbar,
  Alert,
  Fade,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  IconButton as MuiIconButton,
  Collapse,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  DragIndicator as DragIndicatorIcon,
  CalendarToday as CalendarTodayIcon,
  ViewList as ViewListIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { taskService } from './services/api';
import './AppAnimated.css';
import Confetti from 'react-confetti';
import TaskBoard from './components/TaskBoard';
import TaskAnalytics from './components/TaskAnalytics';

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 150,
  color: '#bdbdbd',
  opacity: 0.8,
};

const priorityColors = {
  high: '#ff1744',
  medium: '#ff9100',
  low: '#00e676',
};

const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];

const quotes = [
  'Stay organized, stay productive!',
  'Every big goal starts with a single task.',
  'You can do it! One task at a time.',
  'Success is the sum of small efforts repeated.',
  'Make today count!'
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('Other');
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [view, setView] = useState('list'); // 'list', 'board', or 'analytics'
  const [persistError, setPersistError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      setSnackbar({
        open: true,
        message: 'Failed to fetch tasks',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      try {
        setLoading(true);
        const task = {
          text: newTask,
          completed: false,
          priority: newTaskPriority,
          category: newTaskCategory,
          dueDate: newTaskDueDate,
        };
        
        const response = await taskService.createTask(task);
        
        if (!response || !response.data) {
          throw new Error('Failed to get valid response when creating task');
        }
        
        // Add the new task to our state
        setTasks(prevTasks => [...prevTasks, response.data]);
        
        // Reset form fields
        setNewTask('');
        setNewTaskPriority('medium');
        setNewTaskCategory('Other');
        setNewTaskDueDate(null);
        
        setSnackbar({
          open: true,
          message: 'Task added successfully!',
          severity: 'success',
        });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1800);
      } catch (err) {
        console.error('Error adding task:', err);
        setPersistError('Failed to persist new task to database');
        setSnackbar({
          open: true,
          message: 'Failed to add task. Please try again.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      setLoading(true);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const updatedTask = { ...task, completed: !task.completed };
      const response = await taskService.updateTask(taskId, updatedTask);
      
      // Update both tasks and searchResults if we're searching
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
      if (isSearching) {
        setSearchResults(searchResults.map(t => t.id === taskId ? response.data : t));
      }
      
      setSnackbar({
        open: true,
        message: `Task marked as ${response.data.completed ? 'completed' : 'active'}!`,
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update task',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setLoading(true);
      const result = await taskService.deleteTask(taskId);
      
      if (result && (result.success || result.data)) {
        // Remove the task from the tasks array
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        
        // Also remove from search results if we're searching
        if (isSearching) {
          setSearchResults(prevResults => prevResults.filter(t => t.id !== taskId));
        }
        
        setSnackbar({
          open: true,
          message: 'Task deleted successfully!',
          severity: 'success',
        });
      } else {
        throw new Error('Failed to delete task: Invalid response from server');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setPersistError('Failed to persist delete operation');
      setSnackbar({
        open: true,
        message: 'Failed to delete task. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const getSortedTasks = useCallback(() => {
    let sortedTasks = isSearching ? searchResults : [...tasks];
    
    // Filter first
    sortedTasks = sortedTasks.filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'priority':
        sortedTasks.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        break;
      case 'date':
        sortedTasks.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'dueDate':
        sortedTasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      default:
        break;
    }

    return sortedTasks;
  }, [tasks, filter, sortBy, isSearching, searchResults]);

  const filteredTasks = getSortedTasks();
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleSearch = async (query) => {
    if (query.trim()) {
      try {
        setLoading(true);
        const response = await taskService.searchTasks(query);
        setSearchResults(response.data);
        setIsSearching(true);
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Search failed',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Add a new function to handle priority change
  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      setLoading(true);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const updatedTask = { ...task, priority: newPriority };
      const response = await taskService.updateTask(taskId, updatedTask);
      
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
      
      setSnackbar({
        open: true,
        message: `Task priority changed to ${newPriority}!`,
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update task priority',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add view change handler
  const handleViewChange = (event, newValue) => {
    if (newValue !== null) {
      setView(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {showConfetti && <Confetti numberOfPieces={120} recycle={false} className="confetti-anim" />}
      <Container maxWidth="md" sx={{ mt: 4 }} className="main-bg">
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }} className="main-card floating-card">
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Task Manager
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {persistError && (
            <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setPersistError(null)}>
              {persistError} - Changes may not be saved when you reload the page.
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search tasks by text, category, priority, or due date..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                  },
                },
              }}
              className="animated-input"
            />

            <Collapse in={isSearching}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Found {searchResults.length} matching tasks
                </Typography>
                {searchResults.length > 0 && (
                  <Chip
                    size="small"
                    label={`${searchResults.filter(t => !t.completed).length} active`}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Collapse>

            <Box component="form" onSubmit={handleAddTask} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AddCircleOutlineIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                className="animated-input"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTaskPriority}
                    label="Priority"
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="animated-input"
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTaskCategory}
                    label="Category"
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="animated-input"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <DatePicker
                label="Due Date"
                value={newTaskDueDate}
                onChange={setNewTaskDueDate}
                renderInput={(params) => <TextField {...params} fullWidth className="animated-input" />}
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!newTask.trim()}
                sx={{ minWidth: 120 }}
                className="animated-btn"
              >
                Add Task
              </Button>
            </Box>
          </Box>

          {/* View Toggle Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={view}
              onChange={handleViewChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                value="list"
                label="List View"
                icon={<ViewListIcon />}
                iconPosition="start"
              />
              <Tab
                value="board"
                label="Board View"
                icon={<DashboardIcon />}
                iconPosition="start"
              />
              <Tab
                value="analytics"
                label="Analytics"
                icon={<BarChartIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* List View */}
          {view === 'list' && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={handleFilterChange}
                  size="small"
                  sx={{ flexGrow: 1 }}
                  className="animated-input"
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="active">Active</ToggleButton>
                  <ToggleButton value="completed">Completed</ToggleButton>
                </ToggleButtonGroup>

                <FormControl sx={{ minWidth: 120, ml: 2 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    size="small"
                    className="animated-input"
                  >
                    <MenuItem value="date">Date Added</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                    <MenuItem value="dueDate">Due Date</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ maxHeight: 350, overflowY: 'auto', pr: 1, mb: 1, scrollbarWidth: 'thin', '&::-webkit-scrollbar': { width: 8 }, '&::-webkit-scrollbar-thumb': { background: '#e0e0e0', borderRadius: 4 } }} className="animated-list">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="tasks">
                    {(provided) => (
                      <List {...provided.droppableProps} ref={provided.innerRef}>
                        {filteredTasks.length === 0 ? (
                          <Box sx={emptyStateStyle} className="no-tasks-animation">
                            <AssignmentTurnedInIcon sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="body1">No tasks here! Add your first task.</Typography>
                          </Box>
                        ) : (
                          filteredTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided) => (
                                <Fade in={true}>
                                  <ListItem
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    sx={{
                                      bgcolor: task.completed ? '#e0f7fa' : '#fffde7',
                                      mb: 1,
                                      borderRadius: 2,
                                      boxShadow: 1,
                                      textDecoration: task.completed ? 'line-through' : 'none',
                                      opacity: task.completed ? 0.7 : 1,
                                      transition: 'all 0.3s',
                                    }}
                                    className="animated-list-item"
                                  >
                                    <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                      <DragIndicatorIcon color="action" />
                                    </Box>
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          {task.text}
                                          <Chip
                                            size="small"
                                            label={task.priority}
                                            sx={{
                                              bgcolor: priorityColors[task.priority],
                                              color: 'white',
                                            }}
                                          />
                                          <Chip
                                            size="small"
                                            label={task.category}
                                            variant="outlined"
                                          />
                                          {task.dueDate && (
                                            <Tooltip title="Due Date">
                                              <Chip
                                                size="small"
                                                icon={<CalendarTodayIcon />}
                                                label={new Date(task.dueDate).toLocaleDateString()}
                                                variant="outlined"
                                              />
                                            </Tooltip>
                                          )}
                                        </Box>
                                      }
                                      primaryTypographyProps={{
                                        color: task.completed ? 'text.secondary' : 'text.primary',
                                        fontWeight: task.completed ? 400 : 500,
                                      }}
                                    />
                                    <ListItemSecondaryAction>
                                      <IconButton
                                        edge="end"
                                        onClick={() => handleToggleTask(task.id)}
                                        sx={{ mr: 1 }}
                                        aria-label="toggle complete"
                                      >
                                        <CheckCircleIcon
                                          color={task.completed ? 'success' : 'action'}
                                        />
                                      </IconButton>
                                      <IconButton
                                        edge="end"
                                        onClick={() => handleDeleteTask(task.id)}
                                        aria-label="delete"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                </Fade>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </List>
                    )}
                  </Droppable>
                </DragDropContext>
              </Box>
            </>
          )}

          {/* Board View */}
          {view === 'board' && (
            <TaskBoard
              tasks={isSearching ? searchResults : tasks}
              onPriorityChange={handlePriorityChange}
              onToggleComplete={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {/* Analytics View */}
          {view === 'analytics' && (
            <TaskAnalytics tasks={tasks} />
          )}
        </Paper>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
}

export default App; 