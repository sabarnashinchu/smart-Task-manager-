import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import LabelIcon from '@mui/icons-material/Label';

const priorityColors = {
  high: '#ff5252',
  medium: '#fb8c00',
  low: '#4caf50'
};

const priorityBackground = {
  high: '#ffebee',
  medium: '#fff3e0',
  low: '#e8f5e9'
};

const TaskBoard = ({ tasks, onPriorityChange, onToggleComplete, onDeleteTask }) => {
  const handleDragEnd = (result) => {
    // Drop outside a droppable area
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // If task was moved to a different priority column
    if (source.droppableId !== destination.droppableId) {
      const taskId = parseInt(draggableId);
      onPriorityChange(taskId, destination.droppableId);
    }
  };

  // Separate tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low');

  const renderTask = (task, index) => (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 6 : 1}
          sx={{
            p: 2,
            mb: 1,
            borderRadius: 2,
            backgroundColor: task.completed ? '#f5f5f5' : 'white',
            borderLeft: `4px solid ${priorityColors[task.priority]}`,
            opacity: task.completed ? 0.7 : 1,
            textDecoration: task.completed ? 'line-through' : 'none',
            transition: 'all 0.2s',
            position: 'relative',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <Typography variant="body1" fontWeight={500}>
                {task.text}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                <Tooltip title={`Category: ${task.category}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LabelIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {task.category}
                    </Typography>
                  </Box>
                </Tooltip>
                
                {task.dueDate && (
                  <Tooltip title="Due date">
                    <Typography variant="caption" color="text.secondary">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
            </Box>
            
            <Box>
              <IconButton 
                size="small" 
                onClick={() => onToggleComplete(task.id)}
                sx={{ color: task.completed ? 'success.main' : 'action.active' }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onDeleteTask(task.id)}
                sx={{ color: 'error.light' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </Draggable>
  );

  const renderColumn = (title, taskList, droppableId, color) => (
    <Box 
      sx={{ 
        width: '32%', 
        borderRadius: 2,
        p: 1,
        backgroundColor: priorityBackground[droppableId],
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          p: 1, 
          textAlign: 'center', 
          color: 'white',
          bgcolor: priorityColors[droppableId],
          borderRadius: 1,
          mb: 1
        }}
      >
        {title} ({taskList.length})
      </Typography>
      
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 300,
              flexGrow: 1,
              p: 1,
              transition: 'background-color 0.2s ease',
              backgroundColor: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
              borderRadius: 1,
              overflowY: 'auto'
            }}
          >
            {taskList.map((task, index) => renderTask(task, index))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Task Board - Drag & Drop to Change Priority
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          height: 'calc(100vh - 340px)', 
          minHeight: 400
        }}>
          {renderColumn('High Priority', highPriorityTasks, 'high', 'error.light')}
          {renderColumn('Medium Priority', mediumPriorityTasks, 'medium', 'warning.light')}
          {renderColumn('Low Priority', lowPriorityTasks, 'low', 'success.light')}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default TaskBoard; 