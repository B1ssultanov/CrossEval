import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => Promise<void>;
}

export function RenameModal({ isOpen, onClose, onRename }: RenameModalProps) {
  const [newName, setNewName] = useState("");

  const handleRename = async () => {
    if (newName.trim()) {
      await onRename(newName.trim());
      setNewName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Переименовать сессию</DialogTitle>
        </DialogHeader>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Введите новое название"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Назад
          </Button>
          <Button variant={"cyan"} onClick={handleRename}>
            Переименовать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
