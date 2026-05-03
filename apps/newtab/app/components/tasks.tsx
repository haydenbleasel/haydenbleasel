"use client";

import { Button } from "@haydenbleasel/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@haydenbleasel/design-system/components/ui/card";
import { Checkbox } from "@haydenbleasel/design-system/components/ui/checkbox";
import { Input } from "@haydenbleasel/design-system/components/ui/input";
import { PlusIcon } from "lucide-react";
import { nanoid } from "nanoid";
import type { KeyboardEvent } from "react";
import { useLocalStorage } from "usehooks-ts";

interface Task {
  id: string;
  title: string;
  createdAt: string;
}

export const Tasks = () => {
  const [tasks, saveTasks] = useLocalStorage<Task[] | undefined>("tasks", [], {
    initializeWithValue: false,
  });

  const handleAddTask = () => {
    const newTask = {
      createdAt: new Date().toISOString(),
      id: nanoid(),
      title: "",
    };

    saveTasks([...(tasks ?? []), newTask]);

    setTimeout(() => {
      const input = document.querySelector(
        `[data-task-id="${newTask.id}"] input`
      );

      if (input instanceof HTMLInputElement) {
        input.focus();
      }
    }, 10);

    return newTask.id;
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = tasks?.filter((task) => task.id !== id);

    saveTasks(newTasks);

    setTimeout(() => {
      const lastTask = newTasks?.at(-1);

      if (lastTask) {
        const input = document.querySelector(
          `[data-task-id="${lastTask.id}"] input`
        );

        if (input instanceof HTMLInputElement) {
          input.focus();
        }
      }
    }, 10);
  };

  const handleUpdateTask = (id: string, title: string) => {
    saveTasks(
      tasks?.map((task) => (task.id === id ? { ...task, title } : task))
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      handleAddTask();
    }

    if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
      handleDeleteTask(id);
    }
  };

  return (
    <Card className="gap-0 bg-sidebar p-1 shadow-xs xl:absolute xl:inset-0">
      <CardHeader className="flex items-center justify-between gap-0 px-3 py-2">
        <CardTitle className="font-normal text-muted-foreground text-sm">
          Tasks
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddTask}
          className="-m-2 cursor-pointer"
        >
          <PlusIcon size={16} className="size-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      {tasks?.length ? (
        <CardContent className="divide-y overflow-y-auto rounded-xl border bg-card p-0 shadow-xs">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-3"
              data-task-id={task.id}
            >
              <Checkbox
                checked={false}
                onCheckedChange={() => handleDeleteTask(task.id)}
                className="cursor-pointer"
              />
              <Input
                value={task.title}
                onChange={(e) => handleUpdateTask(task.id, e.target.value)}
                className="h-auto rounded-none border-none bg-transparent p-0 shadow-none outline-none focus-visible:ring-0"
                placeholder="Start typing..."
                onKeyDown={(e) => handleKeyDown(e, task.id)}
              />
              <span className="text-muted-foreground text-xs">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "short",
                }).format(new Date(task.createdAt))}
              </span>
            </div>
          ))}
        </CardContent>
      ) : (
        <div className="flex size-full items-center justify-center p-3">
          <p className="text-muted-foreground text-sm">No tasks.</p>
        </div>
      )}
    </Card>
  );
};
