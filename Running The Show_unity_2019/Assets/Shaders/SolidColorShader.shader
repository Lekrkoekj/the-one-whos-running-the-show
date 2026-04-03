Shader "Custom/SolidColor"
{
    Properties
    {
        [Toggle(DEBRIS)] _Debris ("Debris", Int) = 0
        _CutoutEdgeWidth("Cutout Edge Width", Range(0,0.1)) = 0.02

        // Fed in by Vivify per note
        _Color ("Color", Color) = (1,1,1,1)
        _Cutout ("Cutout", Range(0,1)) = 1
        _CutPlane ("Cut Plane", Vector) = (0, 0, 1, 0)
    }

    SubShader
    {
        Tags { 
            "Queue"="Transparent" 
            "RenderType"="Transparent" 
        }
        LOD 100

        Blend SrcAlpha OneMinusSrcAlpha

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing // Insert for GPU instancing
            #pragma shader_feature DEBRIS

            // Include basic Unity shader helpers & Vivify noise
            #include "UnityCG.cginc"
            #include "Assets/VivifyTemplate/Utilities/Shader Functions/Noise.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float3 localPos : TEXCOORD0; // Needed for noise and cut plane math

                UNITY_VERTEX_INPUT_INSTANCE_ID
                UNITY_VERTEX_OUTPUT_STEREO
            };

            // Register GPU instanced properties (apply per-note)
            UNITY_INSTANCING_BUFFER_START(Props)
            UNITY_DEFINE_INSTANCED_PROP(float4, _Color)
            UNITY_DEFINE_INSTANCED_PROP(float, _Cutout)
            UNITY_DEFINE_INSTANCED_PROP(float4, _CutPlane)
            UNITY_INSTANCING_BUFFER_END(Props)

            // Regular properties
            float _CutoutEdgeWidth;

            v2f vert (appdata v)
            {
                v2f o;

                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_TRANSFER_INSTANCE_ID(v, o);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.pos = UnityObjectToClipPos(v.vertex);
                o.localPos = v.vertex;

                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                UNITY_SETUP_INSTANCE_ID(i);

                // Fetch our instanced Vivify properties
                float4 Color = UNITY_ACCESS_INSTANCED_PROP(Props, _Color);
                float Cutout = UNITY_ACCESS_INSTANCED_PROP(Props, _Cutout);
                float4 CutPlane = UNITY_ACCESS_INSTANCED_PROP(Props, _CutPlane);

                float c = 0;

                #if DEBRIS
                    // Shift our local position along the slice normal by the cut offset
                    float3 samplePoint = i.localPos + CutPlane.xyz * CutPlane.w;

                    // Calculate the signed distance of our point to the cut plane
                    float planeDistance = dot(samplePoint, CutPlane.xyz) / length(CutPlane.xyz);

                    c = planeDistance - Cutout * 0.25;
                #else
                    // Calculate 3D simplex noise based on the fragment position
                    float noise = simplex(i.localPos * 2);

                    // Use cutout to lower the values of the noise into the negatives, clipping them
                    c = noise - Cutout;
                #endif

                // Negative values of c will discard the pixel
                clip(c);

                // Positive values of c close to zero will return a bright white border where the cut happens
                if (c < _CutoutEdgeWidth) {
                    return fixed4(1, 1, 1, 1);
                }

                // Return the solid (or glowing) color driven by Vivify
                return Color;
            }

            ENDCG
        }
    }
}