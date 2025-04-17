import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useOrders } from "../../context/OrderContext";
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge";
import { OrderStatusSelect } from "../../components/orders/OrderStatusSelect";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { DashboardLayout } from "../../components/layout/Dashboard";

// Pagination constants
const PAGE_SIZE = 20;

export default function Orders() {
  const { orders, fetchOrders } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [orders, currentPage]);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);

  // Handle status update success
  const handleStatusUpdate = () => {
    fetchOrders(); // Refresh orders after status update
  };

  return (
    <DashboardLayout>
      {/* Main content area */}
      <div className="flex-1 overflow-x-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Orders</h1>

            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  Manage customer orders and their statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Update Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            #{order.orderID}
                          </TableCell>
                          <TableCell>
                            <div>
                              {order.customer.firstName} {order.customer.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customer.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            ${order.totalPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.orderStatus} />
                          </TableCell>
                          <TableCell>
                            {order.paymentMethod} ({order.paymentStatus})
                          </TableCell>
                          <TableCell>
                            <OrderStatusSelect
                              orderId={order._id}
                              currentStatus={order.orderStatus}
                              onUpdateSuccess={handleStatusUpdate}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}