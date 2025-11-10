"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DateTimePicker from "@/components/ui/date-time-picker";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosInstance from "@/lib/axiosInstance";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconFilter, IconSearch, IconSortAscending } from "@tabler/icons-react";
import { DollarSign, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Users () {
    const [usage, setUsage] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [orderBy, setOrderBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [receiverId, setReceiverId] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [method, setMethod] = useState<string>("manual");

    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [topUpDialog, setTopUpDialog] = useState<boolean>(false);

    const getUsers = () => {
        const data = {
            page,
            limit,
            search,
            order,
            orderBy
        }
        setLoading(true);
        axiosInstance.post('/v1/user/list', data)
            .then((response: any) => {
                setUsage(response.data.data.data);
                setTotalPages(response.data.data.pagination.totalPages);
            })
            .catch(error => {
                console.log(error)
            })
            .finally(()=> {
                setLoading(false);
            })
    }

    const handleTopUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const data = {
            receiverId,
            amount,
            method
        }

        const request = axiosInstance.post('/v1/topup', data)

        toast.promise(request, {
            loading: `Adding balance...`,
            success: (res) => {
                setTopUpDialog(true);
                getUsers();
                setErrors({});
                closeTopUpDialog();
                return res.data.message
            },
            error: (err) => {
                setErrors(err.response.data.errors)
                return err.response.data.message
            }
        })
    }

    const closeTopUpDialog = () => {
        setAmount("");
        setReceiverId("");
        setTopUpDialog(false);
    }
 
    useEffect(()=> {
        getUsers();
    }, [page, limit, search, order, orderBy]);
    return(
        <div className="mx-1 md:mx-3 flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row justify-between gap-3 items-center mt-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Input
                        placeholder="Search by name or secret..."
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        className="pl-8"
                        />
                        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>

                    <Select
                        value={orderBy}
                        onValueChange={(value) => {
                        setOrderBy(value);
                        setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-32">
                        <IconFilter className="h-4 w-4 mr-1" />
                        <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="prefix">Email</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={order}
                        onValueChange={(value) => {
                        setOrder(value);
                        setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-36">
                        <IconSortAscending className="h-4 w-4 mr-1" />
                        <SelectValue placeholder="Order by" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="asc">A-Z</SelectItem>
                        <SelectItem value="desc">Z-A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Card className="p-3">
                <Table className="w-full">
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            <TableHead>
                                No. 
                            </TableHead>
                            <TableHead>
                                Name
                            </TableHead>
                            <TableHead>
                                Email
                            </TableHead>
                            <TableHead>
                                Verified
                            </TableHead>
                            <TableHead>
                                Balance
                            </TableHead>
                            <TableHead>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {
                            loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6">
                                    Loading...
                                    </TableCell>
                                </TableRow>
                            ): usage.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    No Users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                usage.map((key, index) => (
                                    <TableRow key={key.id}>
                                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                                        <TableCell>{key.name }</TableCell>
                                        <TableCell>{key.email}</TableCell>
                                        <TableCell>{key.verifiedAt ? <Badge className="bg-green-500 text-white dark:bg-green-600">Verified</Badge> : <Badge className="bg-red-500 text-white dark:bg-red-600">Not Verified</Badge>}</TableCell>
                                        <TableCell>Rp {key.balance.toLocaleString("id-ID")}</TableCell>
                                        <TableCell>
                                            <Button size={"sm"} onClick={(e)=>{setTopUpDialog(true); setReceiverId(key.id)}}>Top Up</Button>
                                        </TableCell>
                                     </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
                <div className="grid grid-flow-col justify-between w-full items-center gap-8 md:px-5">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
                        </Label>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => {
                                setLimit(Number(value));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue placeholder={limit.toString()} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            disabled={page === 1}
                            onClick={() => setPage(1)}
                        >
                            <span className="sr-only">Go to first page</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            disabled={page === totalPages}
                            onClick={() => setPage(totalPages)}
                        >
                            <span className="sr-only">Go to last page</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {page} of {totalPages}
                    </div>
                </div>
            </Card>
            <Dialog open={topUpDialog} onOpenChange={setTopUpDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={(e) => handleTopUp(e)}>
                        <DialogHeader>
                            <DialogTitle>Top Up</DialogTitle>
                            <DialogDescription>
                                Add credit to a user's balance manually. Ensure the user and amount before proceeding.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup className="gap-2 mt-3">
                            <Field data-invalid={!!errors.name?.length}>
                                <FieldLabel htmlFor="name">Amount</FieldLabel>
                                <div className="relative">
                                    <div className="-translate-y-1/2 absolute top-1/3 left-3 h-4 w-4 text-muted-foreground" >Rp</div>
                                    <Input
                                        className="bg-background pl-9"
                                        id="currency-input"
                                        min="0"
                                        placeholder="0"
                                        step="0"
                                        type="number"
                                        onChange={(e)=>setAmount(e.target.value)}
                                        value={amount}
                                        aria-invalid={!!errors.amount?.length}
                                    />
                                </div>
                                <FieldError errors={errors.amount}/>
                            </Field>
                        </FieldGroup>
                        <DialogFooter className="mt-10">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={closeTopUpDialog}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}