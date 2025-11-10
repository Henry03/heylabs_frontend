"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Upload, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

export default function KtpOcrPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [curlCopied, setCurlCopied] = useState(false);
  const [price, setPrice] = useState<number>(0);

  
  const readableData = result || {};
  const curlCommand = `curl --location 'http://localhost:3002/v1/ktp/ocr?apiKey=YOUR_API_KEY' \\
--form 'image=@"/path/to/ktp.jpg"'`;


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload a KTP image first.");
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    const request = axiosInstance.post('/v1/ktp/ocr', formData);

    toast.promise(request, {
      loading: `Scanning ID Card...`,
      success: (res) => {
        setResult(res.data.data);
        return res.data.message;
      },
      error: (err) => {
        setErrors(err.response.data.errors);
        return err.response.data.message;
      }, finally: () => {
        setLoading(false);
      }
    })
  };

  const handleEndpointDetail = async() => {
    const data = {
      path: "/v1/ktp/ocr"
    }

    axiosInstance.post('/v1/endpoint/detail', data)
      .then((res: any) => {
        setPrice(res.data.data.price);
      })
      .catch(err => {
        console.log(err)
      })
  }

  const copyToClipboard = async (text: string, type: "value" | "curl" = "value") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "curl") {
        setCurlCopied(true);
        setTimeout(() => setCurlCopied(false), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      alert("Failed to copy");
    }
  };

  useEffect(() => {
    handleEndpointDetail();
  },[]);

  return (
    <div className="flex justify-center items-center p-6">
      <Card className="max-w-5xl w-full rounded-2xl shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            🪪 KTP OCR Service
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Extract information from Indonesian KTP images easily.
          </p>
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border bg-secondary w-fit mx-auto"
            )}
            >
                <Coins className="w-4 h-4" />
                <span>Rp {price.toLocaleString("id-ID")} / request</span>
            </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="playground" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="playground">Playground</TabsTrigger>
              <TabsTrigger value="api">API Documentation</TabsTrigger>
            </TabsList>

            {/* ========== PLAYGROUND SECTION ========== */}
            <TabsContent value="playground">
              <Card>
                <CardHeader className="flex flex-col gap-2 items-center">
                  <CardTitle className="text-lg font-semibold">
                    Try Without API Key
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* File Upload */}
                  <div className="flex flex-col items-center gap-3">
                    <label
                      htmlFor="file-upload"
                      className="flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload KTP Image</span>
                    </label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-64 h-auto mt-3 rounded-lg border"
                      />
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !image}
                      className="w-48 font-medium"
                    >
                      {loading ? "Processing..." : "Submit"}
                    </Button>
                  </div>

                  {/* Result */}
                  {result && (
                    <Tabs defaultValue="form" className="w-full mt-6">
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="form">Readable Form</TabsTrigger>
                        <TabsTrigger value="json">Raw JSON</TabsTrigger>
                      </TabsList>

                      {/* Readable Form */}
                      <TabsContent
                        value="form"
                        className="mt-5 p-4 rounded-lg border grid md:grid-cols-2 gap-4"
                      >
                        {Object.keys(readableData).length === 0 ? (
                          <p className="text-center text-sm text-muted-foreground col-span-2">
                            No readable data found.
                          </p>
                        ) : (
                          Object.entries(readableData).map(([key, value]) => (
                            <div key={key} className="flex flex-col gap-1">
                              <label className="text-sm font-medium capitalize">
                                {key.replace(/_/g, " ")}
                              </label>
                              <div className="flex items-center gap-2">
                                <Input
                                  value={
                                    value && value !== "null"
                                      ? String(value)
                                      : "—"
                                  }
                                  readOnly
                                  className="flex-1"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    copyToClipboard(String(value || ""))
                                  }
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </TabsContent>

                      {/* Raw JSON */}
                      <TabsContent value="json" className="mt-5">
                        <Textarea
                          className="w-full min-h-[300px] font-mono text-sm"
                          value={JSON.stringify(result, null, 2)}
                          readOnly
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ========== API DOCUMENTATION SECTION ========== */}
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    API Usage Guide
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Integrate this OCR service into your own app.
                  </p>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div>
                    <p className="font-medium mb-2">📍 Endpoint:</p>
                    <code className="block bg-muted p-2 rounded-md text-sm">
                      POST /v1/ktp/ocr?apiKey=YOUR_API_KEY
                    </code>
                  </div>

                  <div>
                    <p className="font-medium mb-2">🧾 Parameters:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>
                        <strong>apiKey</strong> – Your unique API key.
                      </li>
                      <li>
                        <strong>image</strong> – Image file (form-data).
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium mb-2 flex items-center justify-between">
                      💡 Example (cURL)
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(curlCommand, "curl")}
                      >
                        {curlCopied ? "Copied!" : "Copy cURL"}
                      </Button>
                    </p>
                    <Textarea
                      readOnly
                      className="font-mono text-sm"
                      value={curlCommand}
                    />
                  </div>

                  <div>
                    <p className="font-medium mb-2">✅ Example Response:</p>
                    <Textarea
                      readOnly
                      className="font-mono text-sm"
                      value={`{
  "status": true,
  "message": "KTP processed successfully",
  "data": {
      "nik": "612412125566XXXX",
      "nama": "HEYLABS",
      "tempat_lahir": "JAKARTA PUSAT",
      "tanggal_lahir": "11-09-2025",
      "jenis_kelamin": "LAKI-LAKI",
      "golongan_darah": "O",
      "alamat": "JL. CENDANA NO. 45",
      "rt": "030",
      "rw": "006",
      "kel_desa": "BANING KOTA",
      "kecamatan": "SINTANG",
      "kabupaten_kota": "SINTANG",
      "provinsi": "KALIMANTAN BARAT",
      "tempat_dikeluarkan": "SINTANG",
      "tanggal_dikeluarkan": "11-02-2020",
      "masa_berlaku": "SEUMUR HIDUP",
      "agama": "KATHOLIK",
      "status_perkawinan": "BELUM KAWIN",
      "pekerjaan": "BELUM/TIDAK BEKERJA",
      "kewarganegaraan": "WNI"
  }
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
