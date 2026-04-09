"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { SavedNote } from "../page";

export default function NotesPanel({
  selectedRange,
  notes,
  onSaveNote,
  onDeleteNote,
}: {
  selectedRange: { start: Date; end: Date } | null;
  notes: SavedNote[];
  onSaveNote: (range: { start: Date; end: Date }, text: string) => void;
  onDeleteNote: (id: string) => void;
}) {
  const [note, setNote] = useState<string>("");

  const key = selectedRange
    ? `${selectedRange.start.toISOString().split("T")[0]}_${selectedRange.end
        .toISOString()
        .split("T")[0]}`
    : null;

  useEffect(() => {
    if (!key) {
      setNote("");
      return;
    }

    const saved = notes.find((item) => item.id === key);
    setNote(saved?.text || "");
  }, [key, notes]);

  const saveNote = () => {
    if (!selectedRange) {
      return;
    }

    onSaveNote(selectedRange, note);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this finished note?");

    if (!confirmed) {
      return;
    }

    onDeleteNote(id);

    if (id === key) {
      setNote("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4">
      <h3 className="font-semibold mb-2">Notes</h3>

      {selectedRange ? (
        <p className="text-xs text-gray-500 mb-2">
          Selected: {format(selectedRange.start, "MMM d, yyyy")} to {format(selectedRange.end, "MMM d, yyyy")}
        </p>
      ) : (
        <p className="text-xs text-gray-500 mb-2">Select a start and end date to add a note.</p>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={!selectedRange}
        className="w-full h-28 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        placeholder="Write notes for selected range..."
      />

      <button
        onClick={saveNote}
        disabled={!selectedRange}
        className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Save
      </button>

      <div className="mt-4 border-t pt-3">
        <h4 className="text-sm font-semibold mb-2">Saved Notes</h4>

        {notes.length === 0 ? (
          <p className="text-xs text-gray-500">No notes saved yet.</p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-auto pr-1">
            {notes.map((item) => (
              <div key={item.id} className="rounded-lg border p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-gray-700">
                    {format(new Date(item.start), "MMM d, yyyy")} to {format(new Date(item.end), "MMM d, yyyy")}
                  </p>
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                    title="Range color"
                  />
                </div>

                <p className="text-sm text-gray-800 mt-1 break-words">{item.text}</p>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Finish & Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}