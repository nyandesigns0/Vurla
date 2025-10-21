"use client"

import { useEffect, useRef } from "react"

interface RippleCanvasProps {
  gridSize?: number
  spacing?: number
  rippleSpeed?: number
  maxRadius?: number
  rippleWidth?: number
  autoRipple?: boolean
  autoRippleInterval?: number
  className?: string
  imageUrl?: string
}

export function RippleCanvas({
  gridSize = 200,
  spacing = 10,
  rippleSpeed = 6,
  maxRadius = 20,
  rippleWidth = 20,
  autoRipple = true,
  autoRippleInterval = 1000,
  className = "",
  imageUrl,
}: RippleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, old_x: 0, old_y: 0 })
  const ripplesRef = useRef<Array<{ x: number; y: number; distance: number; speed: number }>>([])
  const gridRef = useRef<Array<Array<{ radius: number; maxRippleRadius: number; color: string }>>>([])
  const animationRef = useRef<number | undefined>(undefined)
  const sampleTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const imageLoadedRef = useRef<boolean>(false)

  // Calculate brightness from RGB values
  const calculateBrightness = (r: number, g: number, b: number): number => {
    return 0.299 * r + 0.587 * g + 0.114 * b
  }

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // Load and sample image
  const loadAndSampleImage = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!imageUrl) {
        resolve()
        return
      }

      const img = new Image()
      img.crossOrigin = "anonymous"
      
      img.onload = () => {
        imageRef.current = img
        imageLoadedRef.current = true
        
        // Create off-screen canvas for sampling
        const sampleCanvas = document.createElement('canvas')
        const sampleCtx = sampleCanvas.getContext('2d')
        if (!sampleCtx) {
          reject(new Error('Could not create sample canvas context'))
          return
        }

        const canvas = canvasRef.current
        if (!canvas) {
          reject(new Error('Canvas not available'))
          return
        }

        // Calculate cover dimensions relative to a target area that matches the ripple grid extents
        // This reduces the apparent zoom while preserving a bg-cover-style fit
        const targetWidth = Math.min(canvas.width, gridSize * spacing)
        const targetHeight = Math.min(canvas.height, gridSize * spacing)
        const canvasAspect = targetWidth / targetHeight
        const imageAspect = img.width / img.height

        let drawWidth, drawHeight, offsetX = 0, offsetY = 0

        if (imageAspect > canvasAspect) {
          // Image is wider - fit target height, crop width
          drawHeight = targetHeight
          drawWidth = img.width * (targetHeight / img.height)
        } else {
          // Image is taller - fit target width, crop height
          drawWidth = targetWidth
          drawHeight = img.height * (targetWidth / img.width)
        }

        // Center horizontally and align to bottom
        offsetX = (canvas.width - drawWidth) / 2
        offsetY = canvas.height - drawHeight

        sampleCanvas.width = canvas.width
        sampleCanvas.height = canvas.height
        
        // Draw image with cover positioning
        sampleCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
        
        // Sample colors at grid positions
        const imageData = sampleCtx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Initialize grid with sampled colors
        gridRef.current = []
        for (let y = 0; y < gridSize; y++) {
          gridRef.current[y] = []
          for (let x = 0; x < gridSize; x++) {
            const gridX = Math.floor((x * spacing) * (canvas.width / (gridSize * spacing)))
            const gridY = Math.floor((y * spacing) * (canvas.height / (gridSize * spacing)))
            
            const pixelIndex = (gridY * canvas.width + gridX) * 4
            const r = data[pixelIndex]
            const g = data[pixelIndex + 1]
            const b = data[pixelIndex + 2]
            
            const brightness = calculateBrightness(r, g, b)
            
            // Map brightness to base radius (1-4px) and max ripple radius (8-24px)
            const baseRadius = 1 + (brightness / 255) * 3
            const maxRippleRadius = 8 + (brightness / 255) * 16
            
            gridRef.current[y][x] = {
              radius: baseRadius,
              maxRippleRadius: maxRippleRadius,
              color: rgbToHex(r, g, b)
            }
          }
        }
        
        resolve()
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      img.src = imageUrl
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Initialize grid - load image if provided, otherwise use random colors
    const initializeGrid = async () => {
      if (imageUrl) {
        try {
          await loadAndSampleImage()
        } catch (error) {
          console.warn('Failed to load image, falling back to random colors:', error)
          initializeRandomGrid()
        }
      } else {
        initializeRandomGrid()
      }
    }

    const initializeRandomGrid = () => {
      gridRef.current = []
      for (let y = 0; y < gridSize; y++) {
        gridRef.current[y] = []
        for (let x = 0; x < gridSize; x++) {
          gridRef.current[y][x] = {
            radius: 2,
            maxRippleRadius: 20,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
          }
        }
      }
    }

    initializeGrid()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.old_x = mouseRef.current.x
      mouseRef.current.old_y = mouseRef.current.y
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleClick = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY)
      if (sampleTimerRef.current) clearTimeout(sampleTimerRef.current)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)

    const angleTools = {
      getAngle: (obj1: { x: number; y: number }, obj2: { x: number; y: number }) => {
        const dX = obj2.x - obj1.x
        const dY = obj2.y - obj1.y
        return (Math.atan2(dY, dX) / Math.PI) * 180
      },
      getDistance: (obj1: { x: number; y: number }, obj2: { x: number; y: number }) => {
        const dx = obj1.x - obj2.x
        const dy = obj1.y - obj2.y
        return Math.sqrt(dx * dx + dy * dy)
      },
    }

    const addRipple = (x: number, y: number, speed?: number) => {
      // Generate random speed multiplier between 0.7 and 1.3 if not provided
      const randomSpeed = speed || rippleSpeed * (0.7 + Math.random() * 0.6)
      ripplesRef.current.push({
        x,
        y,
        distance: 0,
        speed: randomSpeed,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update ripple distances using individual speeds
      for (let i = 0; i < ripplesRef.current.length; i++) {
        ripplesRef.current[i].distance += ripplesRef.current[i].speed
      }

      // Draw grid
      for (let y = 0; y < gridRef.current.length; y++) {
        for (let x = 0; x < gridRef.current[y].length; x++) {
          ctx.fillStyle = gridRef.current[y][x].color

          const pos = { x: x * spacing, y: y * spacing }
          let radius = gridRef.current[y][x].radius

          // Check ripple collision
          for (let j = 0; j < ripplesRef.current.length; j++) {
            const distanceFromRippleCenter = angleTools.getDistance(ripplesRef.current[j], pos)
            if (
              distanceFromRippleCenter > ripplesRef.current[j].distance - rippleWidth &&
              distanceFromRippleCenter < ripplesRef.current[j].distance + rippleWidth
            ) {
              radius *= 2
              if (radius > gridRef.current[y][x].maxRippleRadius) radius = gridRef.current[y][x].maxRippleRadius
            }
          }

          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false)
          ctx.closePath()
          ctx.fill()
        }
      }
    }

    const animloop = () => {
      render()
      animationRef.current = requestAnimationFrame(animloop)
    }

    animationRef.current = requestAnimationFrame(animloop)

    if (autoRipple) {
      const sample = () => {
        // Generate random position across the entire canvas
        const randomX = Math.random() * canvas.width
        const randomY = Math.random() * canvas.height
        addRipple(randomX, randomY)
        sampleTimerRef.current = setTimeout(sample, autoRippleInterval)
      }
      sampleTimerRef.current = setTimeout(sample, autoRippleInterval)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (sampleTimerRef.current) clearTimeout(sampleTimerRef.current)
    }
  }, [gridSize, spacing, rippleSpeed, maxRadius, rippleWidth, autoRipple, autoRippleInterval, imageUrl])

  return <canvas ref={canvasRef} className={`block w-full h-screen ${className}`} />
}
