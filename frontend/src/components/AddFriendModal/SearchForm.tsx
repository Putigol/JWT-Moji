import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void; //gọi lại khi click cancel
}

//phân rã các props trong component
const SearchForm = ({
  register,
  errors,
  usernameValue,
  loading,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semibold">
          Tìm bằng username
        </Label>

        <Input
          id="username"
          placeholder="Gõ tên username vào đây..."
          className="glass border-border/50 focus:border-primary/50 transition-smooth"
          //Input kết nối với react hook form thông qua register
          {...register("username", {
            required: "Username không được bỏ trống",
          })}
        ></Input>
        {/* xử lý lỗi */}
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}

        {isFound === false && (
          <span className="error-message">
            Không tìm thấy
            <span className="font-semibold">@{searchedUsername}</span>
          </span>
        )}
      </div>

      {/* Chứa button cancel và search */}
      <DialogFooter>
        <DialogClose className="flex-1">
          <Button
            type="button"
            variant="outline"
            className="w-full glass hover:text-destructive"
            onClick={onCancel} //gọi lại khi click cancel
          >
            Huỷ bỏ
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading || !usernameValue?.trim()} //username để trống
          className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
        >
          {loading ? (
            <span>Đang tìm ...</span>
          ) : (
            <>
              <Search className="size-4 mr-2" /> Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchForm;
