import { Pagination as AntdPagination } from "antd";

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  showTotal?: boolean;
}

export default function Pagination({
  current,
  pageSize,
  total,
  onChange,
  showTotal = true,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-white px-4 py-3 sm:px-6 shadow-sm mt-4">
      <div className="flex flex-1 items-center justify-between flex-wrap gap-4">
        {showTotal && (
          <div>
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-[#153e75]">
                {(current - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#153e75]">
                {Math.min(current * pageSize, total)}
              </span>{" "}
              of <span className="font-semibold text-[#153e75]">{total}</span> leads
            </p>
          </div>
        )}
        <div className={showTotal ? "ml-auto" : "mx-auto"}>
          <AntdPagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={onChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}
