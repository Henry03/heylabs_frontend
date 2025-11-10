"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import DateTimePicker from "@/components/ui/date-time-picker";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimePickerDemo } from "@/components/ui/time-picker-demo";
import axiosInstance from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconFilter, IconPlus, IconSearch, IconSortAscending } from "@tabler/icons-react";
import { add, format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, ShieldAlert, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Apikeys () {
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [orderBy, setOrderBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [addApiDialog, setAddApiDialog] = useState(false)
    const [deleteApiDialog, setDeleteApiDialog] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [deleteName, setDeleteName] = useState(null)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [name, setName] = useState<string>("");
    const [expireDate, setExpireDate] = useState<Date | undefined>(new Date());
    const [apiKeyResult, setApiKeyResult] = useState<string>("");
    const [apiKeyResultDialog, setApiKeyResultDialog] = useState<boolean>(false);

    const getApiKeys = () => {
        const data = {
            page,
            limit,
            search,
            order,
            orderBy
        }
        setLoading(true);
        axiosInstance.post('/v1/api-key', data)
            .then((response: any) => {
                setApiKeys(response.data.data.data);
                setTotalPages(response.data.data.pagination.totalPages);
            })
            .catch(error => {
                console.log(error)
            })
            .finally(()=> {
                setLoading(false);
            })
    }

    const addApiKeys = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const data = {
            name: name,
            expireDate: expireDate
        }

        const request = axiosInstance.post('/v1/api-key/create', data)

        toast.promise(request, {
            loading: `Creating ${name}...`,
            success: (res) => {
                setApiKeyResult(res.data.data.apiKey)
                setAddApiDialog(false)
                setApiKeyResultDialog(true)
                getApiKeys();
                setExpireDate(new Date());
                setErrors({})
                return res.data.message
            },
            error: (err) => {
                setErrors(err.response.data.errors)
                return err.response.data.message
            }
        })
    }

    const deleteApiKeys = () => {
        const data = {
            id: deleteId
        }

        const request = axiosInstance.post('/v1/api-key/delete', data)

        toast.promise(request, {
            loading: `Deleting ${deleteName}...`,
            success: (res) => {
                setDeleteApiDialog(false)
                getApiKeys();
                return res.data.message
            },
            error: (err) => {
                setDeleteApiDialog(false)
                getApiKeys();
                return err.response.data.message
            }
        })
    }

    const closeApiKeyResultReset = () => {
        setName("");
        setApiKeyResultDialog(false);
        setApiKeyResult("");
    }
 
    useEffect(()=> {
        getApiKeys();
    }, [page, limit, search, order, orderBy]);
    return(
        <div className="mx-1 md:mx-3 flex flex-col gap-2">
            <Alert variant="destructive" className="mt-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Security Reminder</AlertTitle>
                <AlertDescription>
                    Your API keys grant access to your account. Never expose them in client-side code,
                    GitHub repositories, or public forums. Rotate keys regularly.
                </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
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
                        <SelectItem value="prefix">Secret</SelectItem>
                        <SelectItem value="expireAt">Expire At</SelectItem>
                        <SelectItem value="createdAt">Created At</SelectItem>
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
                
                <Button onClick={() => setAddApiDialog(true)}>
                    Add API Keys
                </Button>
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
                                Secret
                            </TableHead>
                            <TableHead>
                                Expire At
                            </TableHead>
                            <TableHead>
                                Created At
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
                            ): apiKeys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    No API keys found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                apiKeys.map((key, index) => (
                                    <TableRow key={key.id}>
                                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                                        <TableCell>{key.name}</TableCell>
                                        <TableCell>{key.prefix}***</TableCell>
                                        <TableCell>{key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : "-"}</TableCell>
                                        <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell><Button variant={"destructive"} size={"icon-sm"} onClick={()=> {setDeleteId(key.id); setDeleteName(key.name); setDeleteApiDialog(true)}}><Trash/></Button></TableCell>
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
            <Dialog open={addApiDialog} onOpenChange={setAddApiDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={(e) => addApiKeys(e)}>
                        <DialogHeader>
                            <DialogTitle>Add API Key</DialogTitle>
                            <DialogDescription>
                                After created this detail cant be edited
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup className="gap-2 mt-3">
                            <Field data-invalid={!!errors.name?.length}>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    type="name"
                                    placeholder="API 1"
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                    aria-invalid={!!errors.name?.length}
                                />
                                <FieldError errors={errors.name}/>
                            </Field>
                            <Field data-invalid={!!errors.expireDate?.length}>
                                <FieldLabel htmlFor="expireDate">Expire Date</FieldLabel>
                                <DateTimePicker date={expireDate} setDate={setExpireDate}/>
                                <FieldError errors={errors.expireDate}/>
                            </Field>
                        </FieldGroup>
                        <DialogFooter className="mt-10">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={apiKeyResultDialog} onOpenChange={(e) => {setApiKeyResultDialog(e);closeApiKeyResultReset()}}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>{name}'s API Key</DialogTitle>
                    <DialogDescription>
                        <strong>Important:</strong> This is the only time you'll be able to view your API key.
                        Store it securely — if you lose it, you'll need to generate a new one.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={apiKeyResult}
                            readOnly
                        />
                    </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteApiDialog} onOpenChange={setDeleteApiDialog}>
                <form>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete API Key</DialogTitle>
                            <DialogDescription>
                                Are you sure want to delete <strong>{deleteName}</strong>?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant={"destructive"} onClick={deleteApiKeys}>Delete anyway</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    )
}