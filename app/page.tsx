"use client";

import { useEffect, useState } from "react";
import Calendar from "./components/Calendar";
import NotesPanel from "./components/NotesPanel";

const STORAGE_KEY = "calendar-notes-v1";

export type SavedNote = {
  id: string;
  start: string;
  end: string;
  text: string;
  color: string;
  createdAt: string;
};

const NOTE_COLORS = [
  "#bfdbfe",
  "#bbf7d0",
  "#fde68a",
  "#fbcfe8",
  "#ddd6fe",
  "#fecaca",
  "#a7f3d0",
  "#fde68a",
];

const buildRangeId = (start: Date, end: Date) =>
  `${start.toISOString().split("T")[0]}_${end.toISOString().split("T")[0]}`;

export default function Home() {
  const [range, setRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [notes, setNotes] = useState<SavedNote[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (!savedNotes) {
      return;
    }

    try {
      const parsed = JSON.parse(savedNotes) as SavedNote[];
      if (Array.isArray(parsed)) {
        setNotes(parsed);
      }
    } catch {
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const saveNoteForRange = (selectedRange: { start: Date; end: Date }, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const noteId = buildRangeId(selectedRange.start, selectedRange.end);

    setNotes((prev) => {
      const existing = prev.find((note) => note.id === noteId);

      if (existing) {
        return prev.map((note) =>
          note.id === noteId
            ? {
                ...note,
                text: trimmed,
              }
            : note
        );
      }

      const nextColor = NOTE_COLORS[prev.length % NOTE_COLORS.length];

      return [
        {
          id: noteId,
          start: selectedRange.start.toISOString(),
          end: selectedRange.end.toISOString(),
          text: trimmed,
          color: nextColor,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

        {/* IMAGE */}
        <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
            className="w-full h-full object-cover"
            alt="calendar"
          />
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <Calendar
            notes={notes}
            onRangeSelect={(start, end) =>
              setRange({ start, end })
            }
          />

          <NotesPanel
            selectedRange={range}
            notes={notes}
            onSaveNote={saveNoteForRange}
            onDeleteNote={deleteNote}
          />
        </div>

      </div>
    </div>
  );
}