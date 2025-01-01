import React from 'react';
import { GoDotFill } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';

import SemiPieChart from '../components/Charts/SemiPieChart'
import { Stacked, Button,  SparkLine, Footer } from '../components';
import { earningData, SparklineAreaData, SparklineAreaDataExpense, activityPosts } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';


const Summary = () => {

  const { currentColor, currentMode } = useStateContext()

  return (
    <section className="mt-24 md:mt-2 mx-7">
      <div className='flex flex-wrap lg:flex-nowrap justify-center flex-col items-center'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full md:w-780 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center shadow-lg  hover:drop-shadow-xl mb-5'>
          <div className='flex justify-between items-center self-center'>
            <div>
              <p className="font-bold text-gray-400">Total Market Cap</p>
              <p className="text-2xl">300,000,000 ELX</p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor={currentColor}
              text="Transactions"
              borderRadius="10px"
              size="md"
            />
          </div>
        </div>

        <div className="flex m-3 flex-wrap justify-center gap-5 items-center">
          {earningData.map((item) => (
            <div
              key={item.title}
              className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-xl hover:drop-shadow-xl cursor-pointer'
            >
              <button
                type='button'
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className='mt-3'>
                <span className='text-lg font-semibold'>
                  {item.amount}
                </span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>

              <p className='text-sm text-gray-400 mt-1'>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-10 flex-wrap justify-center drop-shadow-2xl mt-5'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-1 p-4 rounded-2xl md:w-760'>
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Market cap Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoDotFill />
                </span>
                <span>Buy</span>
              </p>
              <p className="flex items-center gap-2 stacked-budget-color hover:drop-shadow-xl">
                <span>
                  <GoDotFill />
                </span>
                <span>Sell</span>
              </p>
            </div>
          </div>

          <div className='mt-10 flex gap-10 flex-wrap justify-center'>
            <div className='border-r-1 border-color m-4 pr-10'>
              <div>
                <p>
                  <span className='text-3xl font-semibold'>$93,438</span>
                  <span className='p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs'>25%</span>
                </p>
                <p className='text-gray-500 mt-1'>Buy</p>
              </div>

              <div className='mt-8'>
                <p>
                  <span className='text-3xl font-semibold'>$48,984</span>
                </p>
                <p className='text-gray-500 mt-1'>Sell</p>
              </div>

              <div className='mt-5 border-b-2 pb-2'>
                <SparkLine
                  currentColor={currentColor}
                  id="line-sparkline"
                  type="Line"
                  height="80px"
                  width="250px"
                  data={SparklineAreaData}
                  color={currentColor}
                />
              </div>

              <div className='mt-10'>
                <Button
                  color="white"
                  bgColor={currentColor}
                  text="Download Report"
                  borderRadius="10px"
                />
              </div>
            </div>

            <div>
              <Stacked
                width="320px"
                height="360px"
              />
            </div>
          </div>
        </div>

        {/* Earnings & Expenses */}
        <div className='flex flex-row flex-wrap justify-center'>
          {/* Earnings */}
          <div
            className='rounded-2xl md:w-400 p-4 m-3 shadow-xl hover:drop-shadow-2xl cursor-pointer'
            style={{ backgroundColor: currentColor }}
          >
            <div className='flex justify-between items-center mt-5'>
              <p className='font-semibold text-white text-2xl'>
                Earnings
              </p>

              <div>
                <p className='text-2xl text-white font-semibold'>
                  $84,593.36
                </p>
                <p className='text-gray-200'>
                  Monthly Revenue
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <SparkLine
                currentColor={currentColor}
                id="column-sparkLine"
                height='100px'
                width='320'
                type='Column'
                data={SparklineAreaData}
                color="rgb(170, 253, 153)"
              />
            </div>
          </div>

          {/* Expenses */}
          <div
            className='rounded-2xl md:w-400 p-4 m-3 shadow-xl hover:drop-shadow-2xl cursor-pointer'
            style={{ backgroundColor: currentColor }}
          >
            <div className='flex justify-between items-center mt-5'>
              <p className='font-semibold text-white text-2xl'>
                Expenses
              </p>

              <div>
                <p className='text-2xl text-white font-semibold'>
                  $65,287.82
                </p>
                <p className='text-gray-200'>
                  Monthly Expenses
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <SparkLine
                currentColor={currentColor}
                id="column-sparkLine2"
                height='100px'
                width='320'
                type='Column'
                data={SparklineAreaDataExpense}
                color="rgb(255, 127, 127)"
              />
            </div>
          </div>
        </div>

        {/* Pie charts */}
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-2 pt-5 pb-0 m-3 flex justify-center items-center gap-10 flex-col w-full drop-shadow-2xl">

          <div className='self-center mb-0 pb-0'>
            <p className="text-4xl font-semibold text-center">Tokenomics %</p>
          </div>

          <div className='flex items-center flex-wrap justify-center'>

            {/* Semi Pie */}
            <div className='w-fit'>
              <SemiPieChart />
            </div>
          </div>
        </div>


        {/* Weekly Stats */}
        <div className='flex flex-wrap justify-center'>

          {/* Daily Activities */}

          {activityPosts.map((item, index) => (
            <div
              key={index}
              className='w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3 shadow-2xl hover:drop-shadow-xl'
            >
              <div className='flex justify-between'>
                <p className='text-xl font-semibold'>
                  {item.topTitle}
                </p>
                <button
                  type='button'
                  className='text-xl font-semibold text-gray-500'
                >
                  <IoIosMore />
                </button>
              </div>

              <div className='mt-10'>
                

                <div className='mt-8'>
                  <p className='text-lg font-semibold'>
                    {item.postTitle}
                  </p>
                  <p className='text-gray-400'>
                    {item.postAuthor}
                  </p>
                  <p className='mt-5 text-sm text-gray-400'>
                    {item.postText}
                  </p>

                  <div className="mt-5">
                    <Button
                      color="white"
                      bgColor={currentColor}
                      text='Read More'
                      borderRadius='10px'
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </section>
  );
}

export default Summary;

