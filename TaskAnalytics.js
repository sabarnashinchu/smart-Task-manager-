import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider,
  Card,
  CardContent,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import SpeedIcon from '@mui/icons-material/Speed';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const TaskAnalytics = ({ tasks }) => {
  const theme = useTheme();
  
  // Calculate task statistics
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Priority distribution
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
    const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
    
    // Category distribution
    const categoryMap = {};
    tasks.forEach(task => {
      if (!categoryMap[task.category]) {
        categoryMap[task.category] = 0;
      }
      categoryMap[task.category]++;
    });
    
    // Due date analysis
    const overdueTasks = tasks.filter(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return dueDate < new Date();
      }
      return false;
    }).length;

    // Completion time analysis
    const currentDate = new Date();
    const tasksThisWeek = tasks.filter(task => {
      const createdAt = new Date(task.createdAt);
      const diffTime = Math.abs(currentDate - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;
    
    const completedThisWeek = tasks.filter(task => {
      if (!task.completed) return false;
      const createdAt = new Date(task.createdAt);
      const diffTime = Math.abs(currentDate - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;

    const weeklyCompletionRate = tasksThisWeek > 0 ? Math.round((completedThisWeek / tasksThisWeek) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      completionRate,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      categoryDistribution: categoryMap,
      overdueTasks,
      tasksThisWeek,
      completedThisWeek,
      weeklyCompletionRate
    };
  }, [tasks]);
  
  // Prepare chart data
  const priorityChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [stats.highPriorityTasks, stats.mediumPriorityTasks, stats.lowPriorityTasks],
        backgroundColor: [
          '#f44336',
          '#ff9800',
          '#4caf50'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const categoryChartData = {
    labels: Object.keys(stats.categoryDistribution),
    datasets: [
      {
        label: 'Tasks per Category',
        data: Object.values(stats.categoryDistribution),
        backgroundColor: [
          '#3f51b5',
          '#2196f3',
          '#00bcd4',
          '#009688',
          '#4caf50',
          '#8bc34a'
        ],
      },
    ],
  };
  
  const completionChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  
  // Group tasks by week day
  const tasksByDay = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const taskCounts = Array(7).fill(0);
    const completedCounts = Array(7).fill(0);
    
    tasks.forEach(task => {
      const date = new Date(task.createdAt);
      const dayIndex = date.getDay();
      taskCounts[dayIndex]++;
      
      if (task.completed) {
        completedCounts[dayIndex]++;
      }
    });
    
    return {
      labels: days,
      datasets: [
        {
          label: 'Created Tasks',
          data: taskCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: 'Completed Tasks',
          data: completedCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        }
      ]
    };
  }, [tasks]);
  
  // Stats cards
  const StatCard = ({ title, value, icon, color, secondaryValue }) => (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: `${color}20`,
            color: color,
            borderRadius: '50%',
            width: 40,
            height: 40,
            mr: 2
          }}>
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          {value}
        </Typography>
        {secondaryValue && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {secondaryValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Task Analytics & Statistics
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<SpeedIcon />}
            color={theme.palette.primary.main}
            secondaryValue={`${stats.completedTasks} of ${stats.totalTasks} tasks completed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Weekly Progress"
            value={`${stats.weeklyCompletionRate}%`}
            icon={<TrendingUpIcon />}
            color={theme.palette.success.main}
            secondaryValue={`${stats.completedThisWeek} of ${stats.tasksThisWeek} tasks this week`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="High Priority"
            value={stats.highPriorityTasks}
            icon={<PlaylistAddCheckIcon />}
            color={theme.palette.error.main}
            secondaryValue={`${Math.round((stats.highPriorityTasks / (stats.totalTasks || 1)) * 100)}% of all tasks`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue Tasks"
            value={stats.overdueTasks}
            icon={<AssignmentLateIcon />}
            color={theme.palette.warning.main}
            secondaryValue={`${Math.round((stats.overdueTasks / (stats.totalTasks || 1)) * 100)}% of all tasks`}
          />
        </Grid>
      </Grid>
      
      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Overall Completion Progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={stats.completionRate} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundImage: 'linear-gradient(90deg, #4caf50, #8bc34a)'
                }
              }}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${stats.completionRate}%`}</Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Priority Distribution
            </Typography>
            <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
              <Pie data={priorityChartData} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Weekly Activity
            </Typography>
            <Box sx={{ height: 250 }}>
              <Bar data={tasksByDay} options={completionChartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Tasks by Category
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={categoryChartData}
                options={{
                  responsive: true,
                  indexAxis: 'y',
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Insights */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Insights & Recommendations
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box>
          {stats.completionRate < 50 && (
            <Typography variant="body1" paragraph>
              Your task completion rate is below 50%. Consider focusing on completing existing tasks before adding new ones.
            </Typography>
          )}
          {stats.overdueTasks > 0 && (
            <Typography variant="body1" paragraph>
              You have {stats.overdueTasks} overdue tasks. Prioritize these tasks to improve your productivity.
            </Typography>
          )}
          {stats.highPriorityTasks > stats.completedTasks && (
            <Typography variant="body1" paragraph>
              You have more high-priority tasks than completed ones. Consider breaking down complex tasks into smaller, more manageable ones.
            </Typography>
          )}
          {stats.weeklyCompletionRate > stats.completionRate && (
            <Typography variant="body1" paragraph>
              Your weekly completion rate is higher than your overall rate. You're making good progress recently!
            </Typography>
          )}
          {stats.weeklyCompletionRate < stats.completionRate && (
            <Typography variant="body1" paragraph>
              Your weekly completion rate is lower than your overall rate. You might be taking on too many new tasks recently.
            </Typography>
          )}
          {Object.keys(stats.categoryDistribution).length > 0 && (
            <Typography variant="body1">
              Most of your tasks are in the "{Object.entries(stats.categoryDistribution).sort((a, b) => b[1] - a[1])[0][0]}" category.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskAnalytics; 