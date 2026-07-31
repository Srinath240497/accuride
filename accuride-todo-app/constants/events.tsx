import moment from 'moment';

export const myEventsList = [
  {
    id: '1',
    title: 'Review Technical Task',
    description: 'Complete Accuride Frontend Task',
    start: moment().add(1, 'days').set({ hour: 10, minute: 0 }).toDate(),
    end: moment().add(1, 'days').set({ hour: 11, minute: 0 }).toDate(),
    completed: false,
    userId: 'user_1',
  },
  {
    id: '2',
    title: 'Configure Hygraph Schema',
    description: 'Set up Todo Schema',
    start: moment().add(2, 'days').set({ hour: 14, minute: 0 }).toDate(),
    end: moment().add(2, 'days').set({ hour: 15, minute: 0 }).toDate(),
    completed: true,
    userId: 'user_1',
  },
];