import { useAuth } from "../../../context/auth-context";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 6자리 이상입니다."),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    await signIn(data.email, data.password);

    navigate("/");
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">이메일 : </label>
          <input
            type="text"
            id="email"
            placeholder="이메일을 입력해주세요."
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">비밀번호 : </label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요."
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">확인</button>
      </form>
    </div>
  );
};

export default LoginPage;
