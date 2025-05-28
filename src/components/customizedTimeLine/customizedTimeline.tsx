import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { PaletteColor, styled, useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CircleIcon from "@mui/icons-material/Circle";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import CommentIcon from "@mui/icons-material/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import { ProcessHistoryDTO } from "../../Models";


const statusStyles = {
  APPROVED: {
    color: "success" as const,
    icon: <CheckCircleIcon />,
    text: "Approved",
    bgColor: "success.light"
  },
  REJECTED: {
    color: "error" as const,
    icon: <CancelIcon />,
    text: "Rejected",
    bgColor: "error.light"
  },
  PENDING: {
    color: "warning" as const,
    icon: <AccessTimeIcon />,
    text: "Pending",
    bgColor: "warning.light"
  },
  NOT_STARTED: {
    color: "grey" as const,
    icon: <CircleIcon />,
    text: "Not Started",
    bgColor: "grey.200"
  },
  CANCELLED: {
    color: "error" as const,
    icon: <CancelIcon />,
    text: "Cancelled",
    bgColor: "grey.200"
  }
};

const StyledTimeline = styled(Timeline)(({ theme }) => ({
  [`& .${timelineItemClasses.root}:before`]: {
    flex: 0,
    padding: 0
  },
  width: '100%',
  maxWidth: '800px'
}));

const StyledTimelineContent = styled(TimelineContent)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius
  }
}));

interface CustomizedTimelineProps {
  timelineData: ProcessHistoryDTO[];
}

 export const CustomizedTimeline: React.FC<CustomizedTimelineProps> = ({ timelineData }) => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = React.useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatDate = (timestamp: string |undefined ) => {
    const date = new Date(timestamp || 0);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        width: '100%'
      }}
    >
      <Typography variant="h5" gutterBottom sx={{
        fontWeight: 600,
        color: theme.palette.text.primary,
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <CommentIcon color="primary" />
        Process Timeline
      </Typography>

      <StyledTimeline style={{ maxHeight:"400px" ,overflowX:"scroll" , gap:"20px"}}>
        {timelineData.map((item, index) => {
          const status = item.actionStatus
          ? statusStyles[item.actionStatus as keyof typeof statusStyles] || statusStyles.NOT_STARTED
          : statusStyles.NOT_STARTED;
          const hasComments = !!item.comments;
          const isExpanded = expandedItems[index] || false;

          return (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={status.color} sx={{
                  boxShadow: theme.shadows[2],
                  backgroundColor: theme.palette.background.paper
                }}>
                  {React.cloneElement(status.icon, {
                    fontSize: "medium",
                    color: status.color
                  })}
                </TimelineDot>
                {index !== timelineData.length - 1 && (
                  <TimelineConnector sx={{
                    backgroundColor: theme.palette.grey[300],
                    width: '2px'
                  }} />
                )}
              </TimelineSeparator>

              <StyledTimelineContent>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary
                    }}>
                      {item.action}
                    </Typography>
                    <Typography variant="caption" sx={{
                      color: theme.palette.text.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 0.5
                    }}>
                      <PersonIcon fontSize="inherit" />
                      {item.action || "System"}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{
                    color: theme.palette.text.secondary
                  }}>
                    {formatDate(item.timestamp)}
                  </Typography>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 1,
                  gap: 1
                }}>
                  <Chip
                    label={status.text}
                    size="small"
                    icon={status.icon}
                    sx={{
                      backgroundColor: status.bgColor,
                      color: theme.palette.getContrastText((theme.palette[status.color] as PaletteColor)?.main || '#000'),
                      fontWeight: 500
                    }}
                  />

                  {hasComments && (
                    <Tooltip title={isExpanded ? "Hide comments" : "Show comments"}>
                      <IconButton
                        size="small"
                        onClick={() => toggleExpand(index)}
                        sx={{
                          ml: 'auto',
                          transition: theme.transitions.create('transform', {
                            duration: theme.transitions.duration.shortest,
                          }),
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        <ExpandMoreIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {hasComments && (
                  <Collapse in={isExpanded}>
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 1,
                        p: 2,
                        backgroundColor: status.bgColor,
                        color: theme.palette.getContrastText(
                          (theme.palette[status.color] as PaletteColor)?.main || '#000'
                        ),
                        borderRadius: 1,
                        wordBreak: 'break-word'
                      }}
                    >
                      <Typography variant="body2">
                        {item.comments}
                      </Typography>
                    </Paper>
                  </Collapse>
                )}
              </StyledTimelineContent>
            </TimelineItem>
          );
        })}
      </StyledTimeline>
    </Paper>
  );
};

