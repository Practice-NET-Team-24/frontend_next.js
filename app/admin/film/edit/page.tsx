"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Movie } from "@/app/admin/film/edit/types";
import { formatSeconds } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditFilm() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const router = useRouter();

  // Завантаження фільмів із API
  useEffect(() => {
    fetch("/api/films")
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((film: { id: any; name: any; description: any; imageURL: any; trailerURL: any; ageRestriction: any; duration: any; rating: any; movieActors: any; movieGenres: any; }) => ({
          Id: film.id,
          Name: film.name,
          Description: film.description,
          ImageURL: film.imageURL,
          TrailerURL: film.trailerURL,
          AgeRestriction: film.ageRestriction,
          Duration: film.duration,
          Rating: film.rating,
          MovieActors: film.movieActors,
          MovieGenres: film.movieGenres
        }));
        console.log("Formatted films:", formattedData); // 🟢 Лог після трансформації
        setMovies(formattedData);
      })
      .catch((error) => console.error("Error fetching films:", error));
}, []);


  // Видалення фільму через API
  const handleDelete = async () => {
    if (movieToDelete) {
      try {
        const response = await fetch(`/api/films/${movieToDelete.Id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete film");
        }

        // Оновлення стану після видалення
        setMovies(movies.filter((movie) => movie.Id !== movieToDelete.Id));
        console.log(`Deleted movie with ID: ${movieToDelete.Id}`);
      } catch (error) {
        console.error("Error deleting film:", error);
      } finally {
        setMovieToDelete(null);
      }
    }
  };

  const columns: ColumnDef<Movie>[] = [
    {
      accessorKey: "Id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.getValue("Id")}</div>,
    },
    {
      accessorKey: "Name",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("Name")}</div>
      ),
    },
    {
      accessorKey: "Duration",
      header: ({ column }) => (
        <div className={"text-right"}>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Duration
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const duration = formatSeconds(row.getValue("Duration"));
        return <div className="text-right font-medium">{duration}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const movie = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(movie.Id + "")}
              >
                Copy movie ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/admin/film/edit/" + movie.Id)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setMovieToDelete(movie)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: movies,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter title..."
          value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {movieToDelete && (
        <Dialog open={!!movieToDelete} onOpenChange={() => setMovieToDelete(null)}>
          <DialogContent>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <p>Are you sure you want to delete <strong>{movieToDelete.Name}</strong>?</p>
            <DialogFooter>
              <Button onClick={() => setMovieToDelete(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
