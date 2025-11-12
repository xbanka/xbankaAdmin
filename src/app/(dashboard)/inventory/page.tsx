"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Search, Package, CreditCard, Coins, Receipt, RefreshCw, AlertTriangle } from "lucide-react"

// const giftCardStock = [
//   {
//     id: "GC001",
//     brand: "Amazon",
//     denomination: "$25",
//     provider: "CardProvider Inc",
//     stock: 150,
//     reserved: 12,
//     available: 138,
//     lowStockThreshold: 50,
//     lastRestocked: "2024-01-15",
//   },
//   {
//     id: "GC002",
//     brand: "iTunes",
//     denomination: "$50",
//     provider: "CardProvider Inc",
//     stock: 75,
//     reserved: 8,
//     available: 67,
//     lowStockThreshold: 100,
//     lastRestocked: "2024-01-14",
//   },
//   {
//     id: "GC003",
//     brand: "Google Play",
//     denomination: "$100",
//     provider: "DigitalCards Ltd",
//     stock: 25,
//     reserved: 3,
//     available: 22,
//     lowStockThreshold: 30,
//     lastRestocked: "2024-01-13",
//   },
// ]

// const cryptoBalances = [
//   {
//     currency: "Bitcoin",
//     symbol: "BTC",
//     balance: "2.45678901",
//     usdValue: "$98,234.56",
//     address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
//     lastUpdated: "2024-01-16 14:30",
//     status: "Active",
//   },
//   {
//     currency: "Ethereum",
//     symbol: "ETH",
//     balance: "15.23456789",
//     usdValue: "$34,567.89",
//     address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
//     lastUpdated: "2024-01-16 14:28",
//     status: "Active",
//   },
//   {
//     currency: "Tether",
//     symbol: "USDT",
//     balance: "50000.00",
//     usdValue: "$50,000.00",
//     address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
//     lastUpdated: "2024-01-16 14:25",
//     status: "Active",
//   },
// ]

// const billPaymentCredits = [
//   {
//     provider: "Electricity Board",
//     category: "Utilities",
//     balance: "₦125,000.00",
//     reserved: "₦15,000.00",
//     available: "₦110,000.00",
//     lastTopUp: "2024-01-15",
//     status: "Active",
//   },
//   {
//     provider: "Water Authority",
//     category: "Utilities",
//     balance: "₦75,000.00",
//     reserved: "₦8,000.00",
//     available: "₦67,000.00",
//     lastTopUp: "2024-01-14",
//     status: "Active",
//   },
//   {
//     provider: "Telecom Services",
//     category: "Communications",
//     balance: "₦200,000.00",
//     reserved: "₦25,000.00",
//     available: "₦175,000.00",
//     lastTopUp: "2024-01-16",
//     status: "Active",
//   },
// ]

// const reconciliationLogs = [
//   {
//     id: "REC001",
//     type: "Gift Cards",
//     date: "2024-01-16",
//     expectedBalance: "₦2,450,000",
//     actualBalance: "₦2,450,000",
//     variance: "₦0",
//     status: "Matched",
//     reconciler: "Sarah Wilson",
//   },
//   {
//     id: "REC002",
//     type: "Crypto",
//     date: "2024-01-16",
//     expectedBalance: "$182,802.45",
//     actualBalance: "$182,650.23",
//     variance: "-$152.22",
//     status: "Variance",
//     reconciler: "Mike Johnson",
//   },
//   {
//     id: "REC003",
//     type: "Bill Payments",
//     date: "2024-01-15",
//     expectedBalance: "₦400,000",
//     actualBalance: "₦400,000",
//     variance: "₦0",
//     status: "Matched",
//     reconciler: "Tom Brown",
//   },
// ]

export default function InventoryAssets() {
  // const [searchTerm, setSearchTerm] = useState("")

  // const getStockStatus = (available: number, threshold: number) => {
  //   if (available <= threshold * 0.5) return { status: "Critical", color: "bg-main-red" }
  //   if (available <= threshold) return { status: "Low", color: "bg-yellow-500" }
  //   return { status: "Good", color: "bg-main-green" }
  // }

  return (
    <DashboardLayout title="Inventory & Asset Tracker" breadcrumbs={[{ label: "Inventory & Assets" }]}>
      <h1>inventory</h1>
    </DashboardLayout>
  )

  // return (
  //   <DashboardLayout title="Inventory & Asset Tracker" breadcrumbs={[{ label: "Inventory & Assets" }]}>
  //     <Tabs defaultValue="gift-cards" className="w-full">
  //       <TabsList className="grid w-full grid-cols-4">
  //         <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
  //         <TabsTrigger value="crypto">Crypto Wallets</TabsTrigger>
  //         <TabsTrigger value="bills">Bill Credits</TabsTrigger>
  //         <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
  //       </TabsList>

  //       <TabsContent value="gift-cards" className="space-y-4">
  //         <Card className="bg-white">
  //           <CardHeader>
  //             <CardTitle className="flex items-center justify-between">
  //               <span className="flex items-center gap-2 text-deep-blue">
  //                 <CreditCard className="h-5 w-5" />
  //                 Gift Card Stock
  //               </span>
  //               <Button className="bg-main-green hover:bg-main-green/90 flex items-center gap-2">
  //                 <RefreshCw className="h-4 w-4" />
  //                 Restock
  //               </Button>
  //             </CardTitle>
  //             <div className="flex gap-4 mt-4">
  //               <div className="relative flex-1">
  //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
  //                 <Input
  //                   placeholder="Search gift cards..."
  //                   value={searchTerm}
  //                   onChange={(e) => setSearchTerm(e.target.value)}
  //                   className="pl-10"
  //                 />
  //               </div>
  //               <Select>
  //                 <SelectTrigger className="w-[150px]">
  //                   <SelectValue placeholder="Brand" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   <SelectItem value="all">All Brands</SelectItem>
  //                   <SelectItem value="amazon">Amazon</SelectItem>
  //                   <SelectItem value="itunes">iTunes</SelectItem>
  //                   <SelectItem value="google">Google Play</SelectItem>
  //                 </SelectContent>
  //               </Select>
  //             </div>
  //           </CardHeader>
  //           <CardContent>
  //             <Table>
  //               <TableHeader>
  //                 <TableRow>
  //                   <TableHead>Brand</TableHead>
  //                   <TableHead>Denomination</TableHead>
  //                   <TableHead>Provider</TableHead>
  //                   <TableHead>Total Stock</TableHead>
  //                   <TableHead>Reserved</TableHead>
  //                   <TableHead>Available</TableHead>
  //                   <TableHead>Status</TableHead>
  //                   <TableHead>Last Restocked</TableHead>
  //                 </TableRow>
  //               </TableHeader>
  //               <TableBody>
  //                 {giftCardStock.map((card) => {
  //                   const stockStatus = getStockStatus(card.available, card.lowStockThreshold)
  //                   return (
  //                     <TableRow key={card.id}>
  //                       <TableCell className="font-medium">{card.brand}</TableCell>
  //                       <TableCell>{card.denomination}</TableCell>
  //                       <TableCell>{card.provider}</TableCell>
  //                       <TableCell>{card.stock}</TableCell>
  //                       <TableCell>{card.reserved}</TableCell>
  //                       <TableCell className="font-medium">{card.available}</TableCell>
  //                       <TableCell>
  //                         <Badge className={`${stockStatus.color} flex items-center gap-1 w-fit`}>
  //                           {stockStatus.status === "Critical" && <AlertTriangle className="h-3 w-3" />}
  //                           {stockStatus.status}
  //                         </Badge>
  //                       </TableCell>
  //                       <TableCell className="text-sm">{card.lastRestocked}</TableCell>
  //                     </TableRow>
  //                   )
  //                 })}
  //               </TableBody>
  //             </Table>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>

  //       <TabsContent value="crypto" className="space-y-4">
  //         <Card className="bg-white">
  //           <CardHeader>
  //             <CardTitle className="flex items-center justify-between">
  //               <span className="flex items-center gap-2 text-deep-blue">
  //                 <Coins className="h-5 w-5" />
  //                 Crypto Wallet Balances
  //               </span>
  //               <Button variant="outline" className="flex items-center gap-2 bg-transparent">
  //                 <RefreshCw className="h-4 w-4" />
  //                 Refresh Balances
  //               </Button>
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="space-y-4">
  //               {cryptoBalances.map((crypto, index) => (
  //                 <Card key={index} className="bg-off-white">
  //                   <CardContent className="p-4">
  //                     <div className="flex items-center justify-between mb-3">
  //                       <div className="flex items-center gap-3">
  //                         <div className="w-10 h-10 bg-abstract-cyan rounded-full flex items-center justify-center">
  //                           <span className="font-bold text-deep-blue text-sm">{crypto.symbol}</span>
  //                         </div>
  //                         <div>
  //                           <h4 className="font-medium text-deep-blue">{crypto.currency}</h4>
  //                           <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
  //                         </div>
  //                       </div>
  //                       <Badge className="bg-main-green">{crypto.status}</Badge>
  //                     </div>
  //                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
  //                       <div>
  //                         <span className="text-muted-foreground">Balance:</span>
  //                         <div className="font-medium font-mono">
  //                           {crypto.balance} {crypto.symbol}
  //                         </div>
  //                       </div>
  //                       <div>
  //                         <span className="text-muted-foreground">USD Value:</span>
  //                         <div className="font-medium text-main-green">{crypto.usdValue}</div>
  //                       </div>
  //                       <div>
  //                         <span className="text-muted-foreground">Address:</span>
  //                         <div className="font-medium font-mono text-xs">{crypto.address.slice(0, 20)}...</div>
  //                       </div>
  //                       <div>
  //                         <span className="text-muted-foreground">Last Updated:</span>
  //                         <div className="font-medium">{crypto.lastUpdated}</div>
  //                       </div>
  //                     </div>
  //                   </CardContent>
  //                 </Card>
  //               ))}
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>

  //       <TabsContent value="bills" className="space-y-4">
  //         <Card className="bg-white">
  //           <CardHeader>
  //             <CardTitle className="flex items-center justify-between">
  //               <span className="flex items-center gap-2 text-deep-blue">
  //                 <Receipt className="h-5 w-5" />
  //                 Bill Payment Credits
  //               </span>
  //               <Button className="bg-main-green hover:bg-main-green/90 flex items-center gap-2">
  //                 <Package className="h-4 w-4" />
  //                 Top Up Credits
  //               </Button>
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <Table>
  //               <TableHeader>
  //                 <TableRow>
  //                   <TableHead>Provider</TableHead>
  //                   <TableHead>Category</TableHead>
  //                   <TableHead>Total Balance</TableHead>
  //                   <TableHead>Reserved</TableHead>
  //                   <TableHead>Available</TableHead>
  //                   <TableHead>Last Top Up</TableHead>
  //                   <TableHead>Status</TableHead>
  //                 </TableRow>
  //               </TableHeader>
  //               <TableBody>
  //                 {billPaymentCredits.map((credit, index) => (
  //                   <TableRow key={index}>
  //                     <TableCell className="font-medium">{credit.provider}</TableCell>
  //                     <TableCell>{credit.category}</TableCell>
  //                     <TableCell className="font-medium">{credit.balance}</TableCell>
  //                     <TableCell>{credit.reserved}</TableCell>
  //                     <TableCell className="font-medium text-main-green">{credit.available}</TableCell>
  //                     <TableCell className="text-sm">{credit.lastTopUp}</TableCell>
  //                     <TableCell>
  //                       <Badge className="bg-main-green">{credit.status}</Badge>
  //                     </TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>

  //       <TabsContent value="reconciliation" className="space-y-4">
  //         <Card className="bg-white">
  //           <CardHeader>
  //             <CardTitle className="flex items-center gap-2 text-deep-blue">
  //               <Package className="h-5 w-5" />
  //               Reconciliation Logs
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <Table>
  //               <TableHeader>
  //                 <TableRow>
  //                   <TableHead>Type</TableHead>
  //                   <TableHead>Date</TableHead>
  //                   <TableHead>Expected Balance</TableHead>
  //                   <TableHead>Actual Balance</TableHead>
  //                   <TableHead>Variance</TableHead>
  //                   <TableHead>Status</TableHead>
  //                   <TableHead>Reconciler</TableHead>
  //                 </TableRow>
  //               </TableHeader>
  //               <TableBody>
  //                 {reconciliationLogs.map((log) => (
  //                   <TableRow key={log.id}>
  //                     <TableCell className="font-medium">{log.type}</TableCell>
  //                     <TableCell>{log.date}</TableCell>
  //                     <TableCell className="font-mono">{log.expectedBalance}</TableCell>
  //                     <TableCell className="font-mono">{log.actualBalance}</TableCell>
  //                     <TableCell
  //                       className={`font-mono ${log.variance.includes("-") ? "text-main-red" : "text-main-green"}`}
  //                     >
  //                       {log.variance}
  //                     </TableCell>
  //                     <TableCell>
  //                       <Badge className={log.status === "Matched" ? "bg-main-green" : "bg-yellow-500"}>
  //                         {log.status}
  //                       </Badge>
  //                     </TableCell>
  //                     <TableCell>{log.reconciler}</TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </CardContent>
  //         </Card>
  //       </TabsContent>
  //     </Tabs>
  //   </DashboardLayout>
  // )
}
