"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Trash2, Play } from "lucide-react";
import { toast } from "sonner"; // optional
// If you don't have a toast lib, you can remove toast calls.

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

type HeaderItem = { id: string; key: string; value: string; enabled: boolean };

type RequestHistoryItem = {
  id: string;
  method: HttpMethod;
  url: string;
  headers: HeaderItem[];
  body: string;
  timestamp: string;
  status?: number | null;
  summary?: string;
};

type ResponseRecord = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  bodyText: string;
  json?: any;
};

const DEFAULT_HEADERS: HeaderItem[] = [
  { id: "h1", key: "Content-Type", value: "application/json", enabled: true },
];

const STORAGE_KEY = "api_tester_history_v1";

/**
 * ApiTester component
 */
export default function ApiTesterPage() {
  const [activeTab, setActiveTab] = useState<"tester" | "docs">("tester");

  // Request form state
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState<string>("http://localhost:3002/v1/");
  const [headers, setHeaders] = useState<HeaderItem[]>(DEFAULT_HEADERS);
  const [body, setBody] = useState<string>("");
  const [sending, setSending] = useState(false);

  // Response
  const [response, setResponse] = useState<ResponseRecord | null>(null);

  // History
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<RequestHistoryItem | null>(null);

  // Dialog for confirm delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // helpers
  const uid = (prefix = "") => `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const updateHeader = (id: string, patch: Partial<HeaderItem>) => {
    setHeaders((s) => s.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  };

  const addHeader = () => setHeaders((s) => [...s, { id: uid("h"), key: "", value: "", enabled: true }]);
  const removeHeader = (id: string) => setHeaders((s) => s.filter((h) => h.id !== id));

  // Build headers object from state
  const buildHeaders = () => {
    const out: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.enabled && h.key.trim()) out[h.key.trim()] = h.value;
    });
    return out;
  };

  const saveToHistory = (item: RequestHistoryItem) => {
    setHistory((h) => [item, ...h].slice(0, 100)); // keep latest 100
  };

  const clearResponse = () => setResponse(null);

  // Send request (uses fetch so user can hit any URL — might be blocked by CORS)
  const sendRequest = async (saveHistory = true) => {
    if (!url) {
      toast?.error?.("URL is required");
      return;
    }
    setSending(true);
    setResponse(null);

    const requestHeaders = buildHeaders();
    const options: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // attach body for methods that support it
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && body) {
      options.body = body;
    }

    const historyItem: RequestHistoryItem = {
      id: uid("r"),
      method,
      url,
      headers: headers.map((h) => ({ ...h })), // snapshot
      body,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(url, options);
      const headersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => (headersObj[k] = v));

      let text = "";
      let json;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        json = await res.json();
        text = typeof json === "string" ? json : JSON.stringify(json, null, 2);
      } else {
        text = await res.text();
        try {
          json = JSON.parse(text);
        } catch {
          json = undefined;
        }
      }

      const resp: ResponseRecord = {
        status: res.status,
        statusText: res.statusText,
        headers: headersObj,
        bodyText: text,
        json,
      };
      setResponse(resp);

      // save result to history
      if (saveHistory) {
        historyItem.status = res.status;
        historyItem.summary = `${res.status} ${res.statusText}`;
        saveToHistory(historyItem);
      }

      toast?.success?.(`Response ${res.status}`);
    } catch (err: any) {
      setResponse({
        status: 0,
        statusText: err?.message ?? "Network error",
        headers: {},
        bodyText: String(err),
      });
      if (saveHistory) {
        historyItem.status = 0;
        historyItem.summary = String(err?.message ?? "Network error");
        saveToHistory(historyItem);
      }
      toast?.error?.("Request failed");
    } finally {
      setSending(false);
    }
  };

  const runHistory = (item: RequestHistoryItem) => {
    // populate form with history and send without saving duplicate to history
    setMethod(item.method);
    setUrl(item.url);
    setHeaders(item.headers.map((h) => ({ ...h })));
    setBody(item.body);
    setSelectedHistory(item);
    // send but don't save (or choose true to save a run)
    void sendRequest(true);
  };

  const deleteHistory = (id: string) => {
    setHistory((h) => h.filter((x) => x.id !== id));
    setConfirmOpen(false);
    setDeleteId(null);
    toast?.success?.("History deleted");
  };

  const clearAllHistory = () => {
    setHistory([]);
    toast?.success?.("Cleared history");
  };

  const copyResponse = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response.bodyText ?? "");
    toast?.success?.("Response copied");
  };

  // Example API doc data (customize)
  const apiDocs = [
    {
      id: "1",
      name: "Verify KTP",
      method: "POST",
      path: "/v1/ktp/verify",
      description: "Upload KTP image and receive parsed data.",
      requestExample: `POST /v1/ktp/verify
Headers:
  Content-Type: multipart/form-data
Body:
  file: <image file>`,
      responseExample: `{
  "is_ktp": true,
  "nik": "1234567890123456",
  "nama": "BUDI",
  ...
}`,
    },
    {
      id: "2",
      name: "Get Profile",
      method: "GET",
      path: "/v1/profile",
      description: "Returns current user profile (requires auth).",
      requestExample: `GET /v1/profile
Headers:
  Authorization: Bearer <token>`,
      responseExample: `{
  "name": "Henry",
  "email": "henry@example.com",
  "balance": 10000
}`,
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">API Tester & Docs</h1>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => { clearResponse(); setUrl(""); setBody(""); setHeaders(DEFAULT_HEADERS); setMethod("GET"); }}>
            Reset
          </Button>
          <Button onClick={() => { setSelectedHistory(null); setActiveTab("tester"); }}>Focus Tester</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="tester">Tester</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="tester" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Form */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Request</CardTitle>
                <CardDescription>Send a request to any endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex gap-2">
                  <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    {(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as HttpMethod[]).map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>

                  <Input placeholder="https://api.example.com/v1/..." value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
                  <Button onClick={() => sendRequest() } disabled={sending} >
                    <Play className="mr-2 h-4 w-4" /> {sending ? "Sending..." : "Send"}
                  </Button>
                </div>

                {/* Headers */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Headers</span>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setHeaders(DEFAULT_HEADERS)}>Reset</Button>
                      <Button onClick={addHeader}>Add</Button>
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    {headers.map((h) => (
                      <div key={h.id} className="flex gap-2 items-center">
                        <input type="checkbox" checked={h.enabled} onChange={(e) => updateHeader(h.id, { enabled: e.target.checked })} />
                        <Input placeholder="Header name" value={h.key} onChange={(e) => updateHeader(h.id, { key: e.target.value })} className="w-48" />
                        <Input placeholder="value" value={h.value} onChange={(e) => updateHeader(h.id, { value: e.target.value })} className="flex-1" />
                        <Button variant="ghost" onClick={() => removeHeader(h.id)}><Trash2 /></Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Body</span>
                    <div className="text-sm text-muted-foreground">JSON or text</div>
                  </div>
                  <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
                </div>
              </CardContent>
            </Card>

            {/* Right: Response + History */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Response</CardTitle>
                </CardHeader>
                <CardContent>
                  {!response ? (
                    <div className="text-sm text-muted-foreground">No response yet</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={response.status && response.status >= 200 && response.status < 300 ? "default" : "destructive"}>
                            {response.status}
                          </Badge>
                          <div className="font-medium">{response.statusText}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={copyResponse}><Copy className="h-4 w-4" /></Button>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">Headers</div>
                      <ScrollArea className="max-h-28">
                        <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(response.headers, null, 2)}</pre>
                      </ScrollArea>

                      <div className="text-xs text-muted-foreground">Body</div>
                      <ScrollArea className="max-h-60">
                        <pre className="text-sm bg-black/5 p-3 rounded whitespace-pre-wrap break-words">{response.bodyText}</pre>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>History</CardTitle>
                  <CardDescription>Recent requests (local)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-muted-foreground">{history.length} entries</div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => { setHistory((h) => h.slice(0, 10)); toast?.success?.("Trimmed history"); }}>Keep 10</Button>
                      <Button variant="outline" onClick={() => clearAllHistory()}>Clear</Button>
                    </div>
                  </div>

                  <ScrollArea className="max-h-72">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>When</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>URL</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((h) => (
                          <TableRow key={h.id}>
                            <TableCell>{new Date(h.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{h.method}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{h.url}</TableCell>
                            <TableCell>{h.status ?? "-"}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button size="sm" onClick={() => runHistory(h)}>Run</Button>
                              <Dialog open={confirmOpen && deleteId === h.id} onOpenChange={setConfirmOpen}>
                                <DialogTrigger asChild><Button variant="ghost" onClick={() => { setDeleteId(h.id); setConfirmOpen(true); }}>Delete</Button></DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete History</DialogTitle>
                                  </DialogHeader>
                                  <div className="p-4">Are you sure you want to delete this history entry?</div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => { setConfirmOpen(false); setDeleteId(null); }}>Cancel</Button>
                                    <Button onClick={() => deleteHistory(h.id)}>Delete</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Endpoints and examples</CardDescription>
              </CardHeader>
              <CardContent>
                {apiDocs.map((doc) => (
                  <div key={doc.id} className="mb-4">
                    <div className="flex items-center gap-2">
                      <Badge>{doc.method}</Badge>
                      <div className="font-medium">{doc.name}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{doc.description}</div>
                    <div className="mt-2 text-xs">
                      <pre className="bg-muted p-2 rounded">{doc.requestExample}</pre>
                      <pre className="bg-muted p-2 rounded mt-2">{doc.responseExample}</pre>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => { setUrl("http://localhost:3002/v1/ktp/verify"); setMethod("POST"); setActiveTab("tester"); }}>
                  Use Verify KTP
                </Button>
                <Button variant="outline" onClick={() => { setUrl("http://localhost:3002/v1/profile"); setMethod("GET"); setActiveTab("tester"); }}>
                  Use Profile
                </Button>
                <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(window.location.href); toast?.success?.("Link copied"); }}>
                  Copy Page Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

