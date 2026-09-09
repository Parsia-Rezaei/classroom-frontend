import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENT_OPTIONS } from "@/constants";
import { Subject } from "@/types";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const SubjectLists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelecteddepartment] = useState("");

  const departmentFilters =
    selectedDepartment === "all"
      ? []
      : [
          {
            field: "department",
            operator: "eq" as const,
            value: selectedDepartment,
          },
        ];

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const subjectTable = useTable<Subject>({
    columns: useMemo<ColumnDef<Subject>[]>(() => {
      return [
        {
          id: "code",
          accessorKey: "code",
          size: 100,
          header: () => <p className="column-title ml-2">Code</p>,
          cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
        },
        {
          id: "name",
          accessorKey: "name",
          size: 100,
          header: () => <p className="column-title ml-2">Name</p>,
          cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
          filterFn: "includesString", // search based on string
        },
        {
          id: "department",
          accessorKey: "department",
          size: 100,
          header: () => <p className="column-title ml-2">Department</p>,
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          id: "description",
          accessorKey: "description",
          size: 300,
          header: () => <p className="column-title ml-2">Description</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground truncate line-clamp-2">
              {getValue<string>()}
            </span>
          ),
        },
      ];
    }, []),
    refineCoreProps: {
      resource: "subjects",
      filters: {
        permanent: [...departmentFilters, ...searchFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
      pagination: {
        pageSize: 10,
        mode: "server",
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Subjects</h1>

      <div className="intro-row">
        <p>quick access to essential metrics</p>
        <div className="actions-row">
          <div className="search-field relative">
            <Search className="search-icon absolute top-[5px] left-2" />

            <Input
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto my-5">
            <Select
              value={selectedDepartment}
              onValueChange={setSelecteddepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by deparment" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENT_OPTIONS?.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton />
          </div>
          <DataTable table={subjectTable} />
        </div>
      </div>
    </ListView>
  );
};

export default SubjectLists;
