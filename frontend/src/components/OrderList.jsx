import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const OrderList = ({ orders, setOrders, setEditingOrder }) => {
  const { user } = useAuth();

  const handleDelete = async (orderId) => {
    try {
      await axiosInstance.delete(`/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      alert('Failed to delete order.');
    }
  };

  return (
    <div>
      {orders.map((order) => (
        <div key={order._id} className="bg-[#f9f9f7] p-4 mb-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">{order.orderNumber}</h2>
          <p className="text-xl font-bold text-[#2E6D17]">{order.completed}</p>
          <p className="text">{order.description}</p>
          <p className="text">Order Date: {new Date(order.orderDate).toLocaleDateString("en-AU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
          })}

          </p>
          <div className="flex gap-x-2 mb-4 mt-4">

          {user.role === 1 ? 
            (
              <>
              <button
              onClick={() => setEditingOrder(order)}
              className="bg-[#8CB369] px-4 py-2 hover:bg-[#e8d174] rounded-[30px] w-20"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(order._id)}
              className="font-normal font-['Roboto'] bg-[#668a46] text-black p-2 hover:bg-[#e8d174] rounded-[30px] w-20"
            >
              Delete
            </button>
              </>
            ) : (<></>)}
           
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
