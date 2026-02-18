import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { backendApiInstance } from "@/api";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordResetModal({ isOpen, onClose }: PasswordResetModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend route: POST /api/v1/forgot-password
      const response = await backendApiInstance.post("forgot-password", { email });

      if (response.status === 200) {
        console.log('successfuly send the reset link to email')
        toast({
          title: "Сброс пароля",
          description: "Ссылка для сброса пароля выслана на почту.",
          variant: "success",
        });
        onClose();
      } else {
        console.log('not successful sending the reset link to email')
        toast({
          title: "Ошибка",
          description: "Не удалось отправить ссылку для сброса пароля.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending password reset request:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке запроса. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Поменять пароль</DialogTitle>
          <DialogDescription>
            Введите свой адрес электронной почты, и мы вышлем вам ссылку для сброса вашего пароля.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Отправка..." : "Выслать ссылку"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
