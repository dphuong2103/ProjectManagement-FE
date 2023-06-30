import { IProject } from '../data-types/DataType';

export const projects: IProject[] = [
  {
    id: '1',
    name: 'Project A',
    description: 'This is project A',
    leaderID: '12345',
    leader: {
      id: '12345',
      displayName: 'John Doe',
      email: 'john.doe@example.com',
    },
    creatorID: '67890',
    creator: {
      id: '67890',
      displayName: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    isDeleted: false,
    createdTime: new Date('2022-01-01'),
  },
  {
    id: '2',
    name: 'Project B',
    description: 'This is project B',
    leaderID: '54321',
    leader: {
      id: '54321',
      displayName: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
    creatorID: '09876',
    creator: {
      id: '09876',
      displayName: 'Bob Anderson',
      email: 'bob.anderson@example.com',
    },
    isDeleted: false,
    createdTime: new Date('2022-02-02'),
  },
  {
    id: '3',
    name: 'Project C',
    description: 'This is project C',
    leaderID: '98765',
    leader: {
      id: '98765',
      displayName: 'Eva Brown',
      email: 'eva.brown@example.com',
    },
    creatorID: '54321',
    creator: {
      id: '54321',
      displayName: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
    isDeleted: true,
    createdTime: new Date('2022-03-03'),
  },
  {
    id: '4',
    name: 'Project D',
    description: 'This is project D',
    leaderID: '24680',
    leader: {
      id: '24680',
      displayName: 'Mark Wilson',
      email: 'mark.wilson@example.com',
    },
    creatorID: '13579',
    creator: {
      id: '13579',
      displayName: 'Sarah Davis',
      email: 'sarah.davis@example.com',
    },
    isDeleted: false,
    createdTime: new Date('2022-04-04'),
  },
  {
    id: '5',
    name: 'Project E',
    description: 'This is project E',
    leaderID: '97531',
    leader: {
      id: '97531',
      displayName: 'Alex Turner',
      email: 'alex.turner@example.com',
    },
    creatorID: '86420',
    creator: {
      id: '86420',
      displayName: 'Lily Wilson',
      email: 'lily.wilson@example.com',
    },
    isDeleted: false,
    createdTime: new Date('2022-05-05'),
  },
];
