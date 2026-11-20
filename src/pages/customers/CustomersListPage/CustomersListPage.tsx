import { useForm } from "react-hook-form";
import { useCreateCustomer } from "../../../hooks/use-create-customer";
import { useCustomers } from "../../../hooks/use-customers";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Database } from "../../../types/database";

import { tableFeatures, type ColumnDef } from "@tanstack/react-table";
import Table from "../../../components/common/Table/Table";
const customerSchema = z.object({
  name: z.string().min(2, "이름을 입력해주세요"),
  phone: z.string().optional(),
  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다")
    .optional()
    .or(z.literal("")),
  memo: z.string().optional(),
});
type CustomerFormValues = z.infer<typeof customerSchema>;
type Customer = Database["public"]["Tables"]["customers"]["Row"];

const features = tableFeatures({});
const columns: Array<ColumnDef<typeof features, Customer>> = [
  { accessorKey: "name", header: "이름", cell: (info) => info.getValue() },
  { accessorKey: "phone", header: "전화번호", cell: (info) => info.getValue() },
  { accessorKey: "email", header: "이메일", cell: (info) => info.getValue() },
  { accessorKey: "memo", header: "메모", cell: (info) => info.getValue() },
];
const CustomersListPage = () => {
  const { data: customersData, isLoading } = useCustomers();

  const { mutate, isPending } = useCreateCustomer();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = (data: CustomerFormValues) => {
    mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            placeholder="이름을 입력해주세요."
            {...register("name")}
          />
        </div>
        <div>
          <label htmlFor="phone">전화번호</label>
          <input
            type="text"
            id="phone"
            placeholder="전화번호를 입력해주세요."
            {...register("phone")}
          />
        </div>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            id="email"
            placeholder="이메일을 입력해주세요."
            {...register("email")}
          />
        </div>
        <div>
          <label htmlFor="memo">메모</label>
          <input
            type="text"
            id="memo"
            placeholder="메모를 입력해주세요."
            {...register("memo")}
          />
        </div>
        <button type="submit" disabled={isPending}>
          추가
        </button>
      </form>
      {errors.name && <>{errors.name?.message}</>}
      {isLoading && <>Loading....</>}
      {!isLoading && (!customersData || customersData.length === 0) && (
        <>사용자가없습니다.</>
      )}
      {!isLoading && customersData && customersData.length > 0 && (
        <>
          <Table
            tableKey="customers-table"
            columns={columns}
            data={customersData}
          />
        </>
      )}
    </div>
  );
};

export default CustomersListPage;
