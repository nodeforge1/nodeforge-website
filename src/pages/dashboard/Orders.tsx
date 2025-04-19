import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { OrderItem, OrderStatus, useOrders } from '../../context/OrderContext';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { OrderStatusSelect } from '../../components/orders/OrderStatusSelect';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { DashboardLayout } from '../../components/layout/Dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Button } from '../../components/ui/button';
import Cloudnary from '../../components/cloudnary/Cloudnary';

const PAGE_SIZE = 10;

export default function Orders() {
  const { orders, fetchOrders, updateOrderStatus } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchOrders();
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        console.error('Error loading orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Calculate paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [orders, currentPage]);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating status:', err);
    }
  };

  const handleOrderClick = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleRetry = () => {
    setError(null);
    fetchOrders().catch(err => {
      setError('Failed to load orders. Please try again later.');
      console.error('Error loading orders:', err);
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
            <Button
              variant="outline"
              onClick={handleRetry}
              className="mt-2"
            >
              Retry
            </Button>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
                    <TableHeader className="hidden sm:table-header-group">
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order) => (
                          <TableRow
                            key={order._id}
                            onClick={() => handleOrderClick(order)}
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <TableCell className="font-medium">
                              <div className="sm:hidden font-bold mb-2">Order #{order.orderID}</div>
                              <div className="hidden sm:block">#{order.orderID}</div>
                              
                              <div className="sm:hidden space-y-2">
                                <div>
                                  {order.customer.firstName} {order.customer.lastName}
                                  <div className="text-xs text-gray-500">
                                    {order.customer.email}
                                  </div>
                                </div>
                                <div>
                                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                </div>
                                <div>
                                  ${order.totalPrice.toFixed(2)}
                                </div>
                                <div>
                                  <OrderStatusBadge status={order.orderStatus} />
                                </div>
                                <div className="text-sm">
                                  {order.paymentMethod} ({order.paymentStatus})
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell className="hidden sm:table-cell">
                              <div>
                                {order.customer.firstName} {order.customer.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.customer.email}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {format(new Date(order.createdAt), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              ${order.totalPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <OrderStatusBadge status={order.orderStatus} />
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {order.paymentMethod} ({order.paymentStatus})
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                      <div className="order-2 sm:order-1">
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                      <div className="flex gap-2 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          size="sm"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          size="sm"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-[95vw] sm:max-w-7xl w-full bg-white">
                <DialogHeader>
                  <DialogTitle>Order Details #{selectedOrder?.orderID}</DialogTitle>
                </DialogHeader>
                {selectedOrder && (
                  <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Customer Information</h3>
                        <p>
                          {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Shipping Address</h3>
                        <p>{selectedOrder.shippingInfo.address}</p>
                        <p>
                          {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.zipCode}
                        </p>
                        <p>{selectedOrder.shippingInfo.country}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium">Order Items</h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[80px]">Img</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead className="hidden xs:table-cell">Configuration</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedOrder.products?.map((product: any, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Cloudnary 
                                    cldImg={product.image} 
                                    format="auto" 
                                    quality="auto" 
                                    width={80} 
                                    height={80} 
                                    // className="w-12 h-12 object-cover"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="hidden xs:table-cell">
                                  {Object.entries(product.configuration)
                                    .filter(([_, value]) => value)
                                    .map(([key, value]: any) => (
                                      <div key={key} className="text-sm">
                                        {key}: {value.size || value.model || value.type} (+${value.price})
                                      </div>
                                    ))}
                                </TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>${product.basePrice.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div>
                        <h3 className="font-medium">Order Status</h3>
                        <OrderStatusSelect
                          orderId={selectedOrder._id}
                          currentStatus={selectedOrder.orderStatus}
                          onUpdateSuccess={(status: OrderStatus) => {
                            handleStatusUpdate(selectedOrder._id, status);
                            setIsDialogOpen(false);
                          }}
                        />
                      </div>
                      <div className="space-y-2 sm:text-right">
                        <p>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</p>
                        <p>Shipping: ${selectedOrder.shippingCost.toFixed(2)}</p>
                        <p>Tax: ${selectedOrder.tax.toFixed(2)}</p>
                        {selectedOrder.discount > 0 && (
                          <p>Discount: -${selectedOrder.discount.toFixed(2)}</p>
                        )}
                        <p className="font-bold text-lg mt-2">
                          Total: ${selectedOrder.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}