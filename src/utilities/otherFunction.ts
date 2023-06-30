import { ITask, Status, StatusMapping } from '../data-types/DataType';

export function getKeyByValue<T>(object: object, value: T): string {
  return (
    Object.keys(object)
      .find((key) => (object[key as keyof typeof object] as T) === value)
      ?.toString() ?? ''
  );
}

export function getTaskStatusNameByValue(value: number) {
  const statusKey: string = getKeyByValue(StatusMapping, value);
  if (statusKey == '') return null;
  return Status[statusKey as keyof typeof Status];
}

export function initialTask(): ITask {
  return {
    name: '',
    description: '',
    status: 0,
    projectID: '',
    assigneeID: '',
    creatorID: '',
    isDeleted: false,
    createdTime: new Date(),
  };
}
