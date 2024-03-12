import React, { useEffect, useRef } from 'react'
import { init, dispose, registerOverlay, Chart, KLineData } from 'klinecharts'
import generatedDataList from '../generatedDataList'
import Layout from '../Layout'

registerOverlay({
  name: 'circle',
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 3,
  createPointFigures: function ({ overlay, coordinates }) {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x)
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y)
      const radius = Math.sqrt(xDis * xDis + yDis * yDis)
      return {
        key: 'circle',
        type: 'circle',
        attrs: {
          ...coordinates[0],
          r: radius
        },
        styles: {
          style: 'stroke_fill'
        }
      }
    }
    return []
  }
})




export default function DrawGraphMarkKLineChart () {
  const chart = useRef<Chart | null>()
  const setData = ()=>{
    chart.current = init('overlay-k-line')
    chart.current?.applyNewData(generatedDataList())
    const dataList = chart.current?.getDataList() ?? []
    const dataB = dataList[dataList.length - 35] as KLineData
    const dataS = dataList[dataList.length - 10] as KLineData
    const points =  [{ timestamp: dataB?.timestamp, value: dataB?.high },
      { timestamp: dataS?.timestamp, value: dataS?.high }
    ] 
    points.sort((a, b) => {  
      if (a.value < b.value) {  
        return -1;  
      }  
      if (a.value > b.value) {  
        return 1;  
      }  
      return 0; 
    }); 
    points.map(((point,index)=>{
      chart.current?.createOverlay({
        name: 'priceLine',
        extendData: '内置价格线',
        points:[point]
      })
      chart.current?.createOverlay({
        name: 'simpleAnnotation',
        extendData: index===1?'量化信号卖出点':'量化信号买入点',
        points:[point]
      })
      return point
    }))
  }
  useEffect(() => {
    setData()
    return () => {
      dispose('overlay-k-line')
    }
  }, [])

  return (
    <Layout
      title="demo">
      <div id="overlay-k-line" className="k-line-chart"/>
    </Layout>
  )
}
