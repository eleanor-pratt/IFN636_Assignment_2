import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BasketItemList = ({ items, setItems }) => {
  const { user } = useAuth();

  const handleDelete = async (itemId) => {
    try {
      await axiosInstance.delete(`/api/basketItem/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      alert('Failed to delete item.');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return; // prevent < 1
    try {
      const response = await axiosInstance.put(
        `/api/basketItem/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setItems(items.map((item) => (item._id === response.data._id ? response.data : item)));
    } catch (error) {
      alert('Failed to update quantity.');
    }
  };

  const handleCheckout = async () => {
    try {
      await axiosInstance.post(
        `/api/checkout/`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setItems([]);
      alert('Order placed!');
    } catch (error) {
      alert('Failed to checkout.');
    }
  };

  if (!items?.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6
                      bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        Your basket is empty.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="p-4 rounded-xl shadow
                     bg-white dark:bg-slate-900
                     border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {item.plant?.commonName}
          </h2>
          <p className="italic text-slate-600 dark:text-slate-400">
            {item.plant?.botanicalName}
          </p>

          <div className="mt-3">
            <span className="text-slate-700 dark:text-slate-300 mr-3">Quantity:</span>
            <div className="inline-flex items-center gap-3 align-middle">
              <button
                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-3 py-1.5 rounded-lg border
                           border-slate-300 dark:border-slate-600
                           bg-white dark:bg-slate-800
                           text-slate-700 dark:text-slate-200
                           hover:bg-slate-50 dark:hover:bg-slate-700
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                –
              </button>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                {item.quantity}
              </span>
              <button
                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                className="px-3 py-1.5 rounded-lg border
                           border-slate-300 dark:border-slate-600
                           bg-white dark:bg-slate-800
                           text-slate-700 dark:text-slate-200
                           hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex">
            <button
              onClick={() => handleDelete(item._id)}
              className="ml-auto mt-4 text-center w-40 h-10 rounded-[30px]
                         bg-[#d6924d] text-black hover:bg-[#e8d174]
                         dark:text-white dark:hover:bg-[#e4a765]"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleCheckout}
          className="mt-2 text-center w-48 h-10 rounded-[30px]
                     bg-[#d6924d] text-black hover:bg-[#e8d174]
                     dark:text-white dark:hover:bg-[#e4a765]"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default BasketItemList;
