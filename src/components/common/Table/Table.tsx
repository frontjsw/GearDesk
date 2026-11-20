import "./Table.scss";
import { tableFeatures, useTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
interface TableProps<T extends Record<string, any>> {
  tableKey: string;
  columns: ColumnDef<{}, T>[];
  data: T[];
}
const Table = <T extends Record<string, any>>({
  tableKey,
  columns,
  data,
}: TableProps<T>) => {
  const features = tableFeatures({});
  const table = useTable({
    key: tableKey,
    features,
    columns,
    data: data ?? [],
  });
  return (
    <div className="app-table">
      <div className="button-wrap">
        <button>추가</button>
        <button>삭제</button>
      </div>
      <div className="app-table-wrapper">
        <div className="app-table-inner">
          <table className="table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
