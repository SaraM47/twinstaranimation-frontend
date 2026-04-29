// Type for each table column
type Column<T> = {
  header: string;
  className?: string; // Optional extra styling
  render: (item: T, rowIndex: number) => React.ReactNode;
  // Function that renders each table cell
};

// Table component props
type Props<T> = {
  data?: T[]; // Data rows
  columns?: Column<T>[]; // Column definitions
};

// Function component for admin table, generic over type T for flexibility in data types. T means the type of each data item (e.g. User, Series, etc.)
export default function AdminTable<T>({ data = [], columns = [] }: Props<T>) {
  return (
    // Outer table container
    <div className="rounded-2xl border border-gray-200 bg-white overflow-visible">
      <div className="px-5 py-4">
        <table className="w-full text-sm border-separate border-spacing-0">
          {/* Table header */}
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`bg-[#F6F6F6] px-6 py-4 text-left text-sm font-medium text-gray-600 first:rounded-l-xl last:rounded-r-xl ${
                    col.className ?? ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="group">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border-b border-gray-200 px-6 py-5 text-gray-800 group-last:border-b-0 ${
                      col.className ?? ""
                    }`}
                  >
                    {/* Render table cell content */}
                    {col.render(item, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
