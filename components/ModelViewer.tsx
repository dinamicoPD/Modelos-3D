'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { SimpleBox, SimpleRobot, SimpleHouse, SimpleCar } from './SimpleModels';

type ModelViewerProps = {
  modelPath: string;
  title?: string;
  description?: string;
  useSimpleModel?: boolean;
};

// Componente de carga
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-sm text-gray-600">Cargando modelo 3D...</p>
        <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

// Componente del modelo 3D desde archivo
function GLTFModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

// Componente que decide qué modelo usar
function Model({ modelPath, useSimpleModel }: { modelPath: string; useSimpleModel?: boolean }) {
  if (useSimpleModel) {
    // Usar modelos simples generados por código
    const modelId = modelPath.split('/').pop()?.replace('.glb', '');
    
    switch (modelId) {
      case 'robot':
        return <SimpleRobot />;
      case 'box':
      case 'caja':
        return <SimpleBox />;
      case 'house':
      case 'casa':
        return <SimpleHouse />;
      case 'car':
      case 'coche':
        return <SimpleCar />;
      default:
        return <SimpleBox />;
    }
  } else {
    // Usar archivo GLB/GLTF
    return <GLTFModel modelPath={modelPath} />;
  }
}

// Componente de error
function ErrorFallback({ error }: { error: string }) {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg shadow-lg max-w-sm">
        <div className="text-red-500 text-4xl mb-2">⚠️</div>
        <p className="text-sm text-red-700 text-center mb-2">Error cargando modelo 3D</p>
        <p className="text-xs text-red-600 text-center">{error}</p>
      </div>
    </Html>
  );
}

const ModelViewer = ({ modelPath, title, description }: ModelViewerProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    console.error('Error cargando modelo 3D:', err);
    setError('No se pudo cargar el modelo 3D. Verifica que el archivo existe y es válido.');
  };

  return (
    <div className="w-full h-full relative">
      {/* Información del modelo */}
      {(title || description) && (
        <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-xs">
          {title && <h3 className="font-semibold text-sm mb-1">{title}</h3>}
          {description && <p className="text-xs opacity-90">{description}</p>}
        </div>
      )}

      {/* Controles de ayuda */}
      <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-70 text-white p-2 rounded-lg">
        <p className="text-xs">
          🖱️ Clic y arrastra para rotar<br/>
          🔍 Scroll para zoom<br/>
          ✋ Clic derecho para mover
        </p>
      </div>

      {/* Canvas 3D */}
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        onError={handleError}
        className="w-full h-full"
      >
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />

        {/* Modelo 3D con manejo de errores */}
        <Suspense fallback={<Loader />}>
          {error ? (
            <ErrorFallback error={error} />
          ) : (
            <Model modelPath={modelPath} useSimpleModel={true} />
          )}
        </Suspense>

        {/* Controles de órbita */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
        />

        {/* Ambiente */}
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default ModelViewer;