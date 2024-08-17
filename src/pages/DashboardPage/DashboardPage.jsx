import { useEffect, useState } from "react";
import ContentLayout from "../../layout/ContentLayout";
import axios from "axios";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { API_CONFIG } from "../../Constants";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const colors = [
  "rgba(145,200,132)",
  "rgba(255,99,132)",
  "rgba(54,162,235)",
  "rgba(255,205,86)",
  "rgba(75,192,192)",
  "rgba(153,102,255)",
];
const getColorByIndex = (index) => {
  return colors[index % colors.length];
};

const DashboardPage = () => {
  const [totalBibliographies, setTotalBibliographies] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalBibliographiesByCategory, setTotalBibliographiesByCategory] =
    useState([]);
  const [loading, setLoading] = useState(0);

  const fetchTotalBibliographiesByCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_CONFIG.CATEGORIES}/totalBibliographies`
      );
      setTotalBibliographiesByCategory(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalBibliographies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_CONFIG.TOTAL_BIBLIOGRAPHIES);
      setTotalBibliographies(response.data.total_bibliographies);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_CONFIG.TOTAL_CATEGORIES);
      setTotalCategories(response.data.totalCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  useEffect(() => {
    fetchTotalBibliographies();
    fetchTotalCategories();
    fetchTotalBibliographiesByCategory();
  }, []);
  return (
    <ContentLayout bgColor={"!bg-cuk"}>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4">
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {totalUser}
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-blue-500 dark:text-blue-100 bg-blue-100 dark:bg-blue-500 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-book-open-text"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                <path d="M6 8h2" />
                <path d="M6 12h2" />
                <path d="M16 8h2" />
                <path d="M16 12h2" />
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Bibliographies
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {totalBibliographies}
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-teal-500 dark:text-teal-100 bg-teal-100 dark:bg-teal-500 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="category"
              >
                <g fill="#200E32" transform="translate(2 2)">
                  <path
                    d="M14.0755097,2.66453526e-15 L17.4614756,2.66453526e-15 C18.8637443,2.66453526e-15 20,1.1458518 20,2.55996321 L20,5.97452492 C20,7.38863633 18.8637443,8.53448813 17.4614756,8.53448813 L14.0755097,8.53448813 C12.673241,8.53448813 11.5369853,7.38863633 11.5369853,5.97452492 L11.5369853,2.55996321 C11.5369853,1.1458518 12.673241,2.66453526e-15 14.0755097,2.66453526e-15"
                    opacity=".4"
                  ></path>
                  <path d="M5.9244903,11.4655119 C7.32675901,11.4655119 8.46301469,12.6113637 8.46301469,14.0254751 L8.46301469,17.4400368 C8.46301469,18.8531901 7.32675901,20 5.9244903,20 L2.53852439,20 C1.13625568,20 8.8817842e-16,18.8531901 8.8817842e-16,17.4400368 L8.8817842e-16,14.0254751 C8.8817842e-16,12.6113637 1.13625568,11.4655119 2.53852439,11.4655119 L5.9244903,11.4655119 Z M17.4614756,11.4655119 C18.8637443,11.4655119 20,12.6113637 20,14.0254751 L20,17.4400368 C20,18.8531901 18.8637443,20 17.4614756,20 L14.0755097,20 C12.673241,20 11.5369853,18.8531901 11.5369853,17.4400368 L11.5369853,14.0254751 C11.5369853,12.6113637 12.673241,11.4655119 14.0755097,11.4655119 L17.4614756,11.4655119 Z M5.9244903,7.99360578e-15 C7.32675901,7.99360578e-15 8.46301469,1.1458518 8.46301469,2.55996321 L8.46301469,5.97452492 C8.46301469,7.38863633 7.32675901,8.53448813 5.9244903,8.53448813 L2.53852439,8.53448813 C1.13625568,8.53448813 8.8817842e-16,7.38863633 8.8817842e-16,5.97452492 L8.8817842e-16,2.55996321 C8.8817842e-16,1.1458518 1.13625568,7.99360578e-15 2.53852439,7.99360578e-15 L5.9244903,7.99360578e-15 Z"></path>
                </g>
              </svg>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Categories
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {totalCategories}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={"bg-white p-6 rounded-xl min-h-custom "}>
        <h1 className="text-center text-2xl">
          Total Bibliographies Per Category
        </h1>
        <Bar
          options={options}
          data={{
            labels: totalBibliographiesByCategory.map((datum) => datum.label),
            datasets: [
              {
                label: null,
                data: totalBibliographiesByCategory.map((datum) => datum.total),
                backgroundColor: totalBibliographiesByCategory.map(
                  (user, index) => getColorByIndex(index)
                ),
              },
            ],
          }}
        />
      </div>
    </ContentLayout>
  );
};

export default DashboardPage;
