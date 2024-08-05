// 'use client';

// import { Line } from 'react-chartjs-2';
// import {
//     ChartArea,
//     Chart as ChartJS,
//     ChartOptions,
//     registerables,
//     ScriptableContext,
//     TooltipItem,
// } from 'chart.js';
// // import { ChartOptions } from 'chart.js'; // Import the ChartOptions type

// import type {
//     DailyLowestPrice,
//     DealProductDetailInfo,
//     PriceIntelligence,
//     Product,
// } from '@/apis';
// import { formatDateToMD } from '@/utils';
// // import { useUserStore } from '@/stores';
// // import { Avatar, AvatarImage } from '@/components';
// // import { px } from 'framer-motion';
// // import { Product, getProductsData, Log, PriceList } from '@/apis';

// interface Props {
//     product?: Product;
//     dailyLowestPrices: DailyLowestPrice[] | null;
//     priceIntelligence: PriceIntelligence | null;
//     deal?: DealProductDetailInfo;
//     userInputPrice?: number | null;
//     userInputUnitPrice?: number | null;
//     forProduct?: boolean;
//     forDeal?: boolean;
// }

// export function PriceReport({
//     // product,
//     dailyLowestPrices,
//     priceIntelligence,
//     // forDeal = false,
//     // userInputUnitPrice,
//     forProduct = false,
// }: Props) {
//     // const { user } = useUserStore();

//     // const averagePrice =
//     //     (forProduct
//     //         ? priceIntelligence?.dailyAveragePrice
//     //         : priceIntelligence?.dailyAveragePricePerUnit) ?? 0;

//     // const dailyPrices =
//     //     dailyLowestPrices?.map((item) =>
//     //         forProduct ? item.dailyLowestPrice : item.dailyLowestPricePerUnit,
//     //     ) ?? [];
//     // const dailyAmounts = dailyPrices.map((item) => item.amount);
//     // const dailyDates = dailyPrices.map((item) => item.createdAt);
//     // const mallNames = dailyPrices.map((item) => item.mallName);

//     // const formatDailyDate = dailyDates.map(formatDateToMD);

//     // const customPrice =
//     //     product?.alert?.customPriceAlert === true && product.alert.customPrice;

//     // const labels = formatDailyDate || {};
//     // const data = {
//     //     labels,
//     //     datasets: [
//     //         {
//     //             label: '당일 최저 가격',
//     //             fill: 'start',
//     //             data: dailyAmounts,
//     //             borderColor: '#2d3750',
//     //             // backgroundColor: '#736ba166',
//     //             backgroundColor: 'transparent',
//     //             pointHitRadius: 5,
//     //         },
//     //         {
//     //             label: '알림 설정 가격', // 범례에 표시될 레이블
//     //             data: customPrice ? Array(labels.length).fill(customPrice) : [],
//     //             borderColor: 'red', // 선 색상 (빨간색)
//     //             backgroundColor: 'transparent', // 채우기 없음
//     //             pointRadius: 0, // 점 없음
//     //             borderWidth: 1, // 선 두께
//     //             borderDash: [5, 5], // 점선으로 표시
//     //         },
//     //         {
//     //             label: `최근 ${priceIntelligence?.dayCount || 'x'}일 평균가`,
//     //             data: Array(labels.length).fill(averagePrice),
//     //             borderColor: 'black',
//     //             borderWidth: 1,
//     //             // borderDash: [2, 2], // 점선으로 표시
//     //             pointRadius: 0,
//     //         },
//     //         // {
//     //         //     label: `최근 ${calculator?.dayCount || 'x'}일 최저가`,
//     //         //     data: Array(labels.length).fill(lowestPrice),
//     //         //     borderColor: 'blue',
//     //         //     borderDash: [2, 2],
//     //         //     pointRadius: 0,
//     //         // },
//     //     ],
//     // };
//     // if (userInputUnitPrice) {
//     //     data.datasets.push({
//     //         label: forDeal
//     //             ? '🔥 핫딜'
//     //             : user
//     //               ? `${user.nickName || ''}님의 딜`
//     //               : '나의 핫딜',
//     //         data: Array(labels.length).fill(userInputUnitPrice),
//     //         borderColor: 'green',
//     //         borderWidth: 2,
//     //         // borderDash: [2, 2], // 점선으로 표시
//     //         pointRadius: 0,
//     //     });
//     // }
//     // const options: ChartOptions<'line'> = {
//     //     animation: {
//     //         duration: 1000, // 애니메이션 시간 조절
//     //         easing: 'easeOutQuart', // 애니메이션 효과
//     //     },
//     //     responsive: true,
//     //     plugins: {
//     //         legend: {
//     //             display: false,
//     //         },
//     //         tooltip: {
//     //             // 툴팁 활성화
//     //             // position: 'nearest', // 툴팁 위치 조절
//     //             caretPadding: 10, // 툴팁과 데이터 포인트 사이 간격 조절
//     //             // yAlign: 'bottom', // 툴팁 아래쪽 정렬
//     //             // xAlign: 'center', // 툴팁 가운데 정렬
//     //             enabled: true,
//     //             callbacks: {
//     //                 title: (tooltipItems) => {
//     //                     // 툴팁 제목 커스터마이징
//     //                     return tooltipItems[0].label; // x축 레이블 표시
//     //                 },
//     //                 label: (context) => {
//     //                     const index = context.dataIndex;
//     //                     const mallName = mallNames[index] || '';

//     //                     if (
//     //                         context.dataset.label === '당일 최저 가격'
//     //                         // ||
//     //                         // context.dataset.label ===
//     //                         //     `최근 ${calculator?.dayCount || 'x'}일 평균가`
//     //                     ) {
//     //                         return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}원 ${mallName ? `(${mallName})` : ''}`;
//     //                     } else {
//     //                         return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}원`;
//     //                     }
//     //                 },
//     //             },
//     //             mode: 'index', // x축 인덱스에 따라 툴팁 표시
//     //             intersect: false,
//     //         },
//     //     },
//     //     scales: {
//     //         x: {
//     //             grid: {
//     //                 display: false,
//     //                 color: '#f0f0f0', // 그리드 색상 변경
//     //             },
//     //             ticks: {
//     //                 display: true,
//     //                 color: '#666', // x축 레이블 색상 변경
//     //                 font: {
//     //                     family: 'Pretendard', // 폰트 변경
//     //                     size: 11,
//     //                 },
//     //             },
//     //         },
//     //         y: {
//     //             grace: '10%',
//     //             grid: {
//     //                 display: false,
//     //             },
//     //             display: true,
//     //             ticks: {
//     //                 display: true,
//     //                 color: '#666', // y축 레이블 색상 변경
//     //                 font: {
//     //                     family: 'Pretendard', // 폰트 변경
//     //                     size: 11,
//     //                 },
//     //                 callback: (value) => `${value.toLocaleString()}`, // y축 레이블 형식 지정
//     //             },
//     //         },
//     //     },
//     //     elements: {
//     //         line: {
//     //             tension: 0.2, // 데이터 라인 곡선 설정
//     //             borderWidth: 1, // 데이터 라인 두께 설정
//     //             borderColor: '#007bff', // 데이터 라인 색상 변경
//     //             backgroundColor: '#007bff33', // 채우기 색상 변경 (투명도 추가)
//     //         },
//     //         point: {
//     //             radius: 1, // 포인트 크기 설정
//     //             backgroundColor: '#fff', // 포인트 배경 색상 변경
//     //             borderColor: '#007bff', // 포인트 테두리 색상 변경
//     //             borderWidth: 2, // 포인트 테두리 두께 설정
//     //         },
//     //     },
//     //     layout: {
//     //         padding: {
//     //             top: 30,
//     //             bottom: 10,
//     //         }, // 차트 여백 설정
//     //     },
//     // };

//     // ChartJS.register(...registerables);

//     const averagePrice = forProduct
//         ? priceIntelligence?.dailyAveragePrice
//         : priceIntelligence?.dailyAveragePricePerUnit ?? 0;

//     const dailyPrices =
//         dailyLowestPrices?.map((item) =>
//             forProduct ? item.dailyLowestPrice : item.dailyLowestPricePerUnit,
//         ) ?? [];

//     const dailyAmounts = dailyPrices.map((item) => item.amount);
//     const dailyDates = dailyPrices.map((item) => item.createdAt);
//     const formatDailyDate = dailyDates.map(formatDateToMD);

//     // 최고가와 최저가 찾기
//     const maxPrice = Math.max(...dailyAmounts);
//     const minPrice = Math.min(...dailyAmounts);
//     const maxPriceIndex = dailyAmounts.indexOf(maxPrice);
//     const minPriceIndex = dailyAmounts.indexOf(minPrice);

//     const data = {
//         labels: formatDailyDate,
//         datasets: [
//             {
//                 data: dailyAmounts,
//                 borderColor: '#090909',
//                 fill: false,
//                 pointRadius: (ctx: ScriptableContext<'line'>) => {
//                     const index = ctx.dataIndex;
//                     return index === maxPriceIndex || index === minPriceIndex
//                         ? 4
//                         : 0;
//                 },
//                 pointBackgroundColor: (ctx: ScriptableContext<'line'>) => {
//                     const index = ctx.dataIndex;
//                     return index === maxPriceIndex
//                         ? 'blue'
//                         : index === minPriceIndex
//                           ? 'red'
//                           : '#007bff';
//                 },
//                 pointBorderColor: (ctx: ScriptableContext<'line'>) => {
//                     const index = ctx.dataIndex;
//                     return index === maxPriceIndex
//                         ? 'blue'
//                         : index === minPriceIndex
//                           ? 'red'
//                           : '#007bff';
//                 },
//                 pointHoverRadius: 5,
//             },
//             {
//                 data: Array(formatDailyDate.length).fill(averagePrice),
//                 borderColor: '#28a745',
//                 borderWidth: 2,
//                 borderDash: [5, 5],
//                 pointRadius: 0,
//             },
//         ],
//     };

//     const options: ChartOptions<'line'> = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: { display: false },
//             title: { display: false },
//             tooltip: {
//                 callbacks: {
//                     title: (tooltipItems: TooltipItem<'line'>[]) => {
//                         return formatDailyDate[tooltipItems[0].dataIndex];
//                     },
//                     label: (context: TooltipItem<'line'>) => {
//                         let label = context.dataset.label || '';
//                         if (label) {
//                             label += ': ';
//                         }
//                         if (context.parsed.y !== null) {
//                             label += new Intl.NumberFormat('ko-KR', {
//                                 style: 'currency',
//                                 currency: 'KRW',
//                             }).format(context.parsed.y);
//                         }
//                         return label;
//                     },
//                 },
//             },
//         },
//         scales: {
//             x: { display: false },
//             y: { display: false },
//         },
//     };
//     // const maxIndex = dailyAmounts.indexOf(maxPrice);
//     // const minIndex = dailyAmounts.indexOf(minPrice);

//     // const customLabelsPlugin = {
//     //     id: 'customLabels',
//     //     afterDraw: (chart: ChartJS) => {
//     //         const { ctx, chartArea, scales } = chart;
//     //         const { right, top } = chartArea;

//     //         ctx.save();
//     //         ctx.font = '12px Arial';
//     //         ctx.textAlign = 'center';

//     //         const maxIndex = dailyAmounts.indexOf(maxPrice);
//     //         const minIndex = dailyAmounts.indexOf(minPrice);

//     //         const drawLabel = (
//     //             index: number,
//     //             text: string,
//     //             color: string,
//     //             xOffset: number,
//     //             yOffset: number,
//     //         ) => {
//     //             const x = scales.x.getPixelForValue(index);
//     //             const y = scales.y.getPixelForValue(dailyAmounts[index]);
//     //             ctx.fillStyle = color;
//     //             ctx.fillText(text, x + xOffset, y + yOffset);
//     //         };

//     //         // 최고가 라벨 (포인트 위에)
//     //         drawLabel(
//     //             maxIndex,
//     //             `역대 최고가 ${maxPrice.toLocaleString()}원`,
//     //             'blue',
//     //             0,
//     //             -20,
//     //         );

//     //         // 최저가 라벨 (포인트 아래에)
//     //         drawLabel(
//     //             minIndex,
//     //             `역대 최저가 ${minPrice.toLocaleString()}원`,
//     //             'red',
//     //             0,
//     //             30,
//     //         );

//     //         // 평균가 라벨 (오른쪽 위에)
//     //         if (averagePrice) {
//     //             ctx.textAlign = 'right';
//     //             ctx.fillStyle = 'green';
//     //             ctx.fillText(
//     //                 `평균가 ${averagePrice.toLocaleString()}원`,
//     //                 right - 10,
//     //                 top + 20,
//     //             );
//     //         }

//     //         ctx.restore();
//     //     },
//     // };

//     ChartJS.register(...registerables);
//     return (
//         <>
//             <div className="p-1 w-[100px] h-[200px]">
//                 <div>{maxPrice}</div>
//                 <Line data={data} options={options} />
//                 <div>{minPrice}</div>
//             </div>
//             {/* <div
//                 className="box-border w-auto h-auto border-2
//             rounded-lg shadow-lg flex justify-between p-1 pl-2"
//             >
//                 <div className="w-full">
//                     <div
//                         className={`transition-all duration-500 flex flex-col gap-1
//                         `}
//                     >
//                         <div className="relative">
//                             <Line
//                                 className="p-1"
//                                 options={options}
//                                 data={data}
//                             />
//                             <div className="text-left flex flex-col absolute right-0 top-[-5px] text-[8px]">
//                                 <div className="h-2 ">
//                                     <span className="text-sm">... </span>일별
//                                     최저가
//                                 </div>
//                                 {priceIntelligence?.dayCount ? (
//                                     <div className="h-2">
//                                         <span className="text-sm">ㅡ </span>
//                                         {priceIntelligence.dayCount}일 평균가
//                                     </div>
//                                 ) : (
//                                     <div className="h-2">
//                                         <span className="text-sm">ㅡ </span>
//                                         X별 최저가
//                                     </div>
//                                 )}
//                                 {userInputUnitPrice ? (
//                                     <div className="h-2 items-center">
//                                         {!forDeal && user ? (
//                                             <div className="flex gap-3 items-center pt-1">
//                                                 <span className="text-teal-600 text-sm pb-1">
//                                                     ㅡ{' '}
//                                                 </span>{' '}
//                                                 <Avatar className="w-[16px] h-[16px]">
//                                                     <AvatarImage
//                                                         src={user?.profile}
//                                                         alt="User Profile"
//                                                     />
//                                                 </Avatar>
//                                             </div>
//                                         ) : (
//                                             <>
//                                                 {forDeal ? (
//                                                     <div className="flex gap-1 items-center">
//                                                         <span className="text-teal-600 text-sm pb-1">
//                                                             ㅡ{' '}
//                                                         </span>{' '}
//                                                         <div className="">
//                                                             🔥 핫딜
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     <div className="flex gap-1 items-center">
//                                                         <span className="text-teal-600 text-sm pb-1">
//                                                             ㅡ{' '}
//                                                         </span>{' '}
//                                                         <div className="">
//                                                             내 딜
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <></>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div> */}
//         </>
//     );
// }
