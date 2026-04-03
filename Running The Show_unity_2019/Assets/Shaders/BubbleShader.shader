Shader "Custom/BeatSaberBubble"
{
    Properties
    {
        [Toggle(DEBRIS)] _Debris ("Debris", Int) = 0
        _CutoutEdgeWidth("Cutout Edge Width", Range(0,0.1)) = 0.02
        
        // Fed in by Vivify per note
        _Cutout ("Cutout", Range(0,1)) = 1
        _CutPlane ("Cut Plane", Vector) = (0, 0, 1, 0)
        _Color ("Fresnel Color (Vivify Note Color)", Color) = (1, 1, 1, 0.05)
        
        // Bubble Properties
        _BaseColor ("Base Color", Color) = (0.2, 0.5, 1, 0.05)
        _FresnelPower ("Fresnel Power", float) = 5
        _Intensity ("Intensity", float) = 0.6
        _Alpha ("Alpha (Bloom Control)", Range(0, 1)) = 0.05
    }

    SubShader
    {
        Tags { "Queue"="Transparent" "RenderType"="Transparent" }

        Blend SrcAlpha OneMinusSrcAlpha   // IMPORTANT: not additive
        ZWrite Off
        
        // Note: You currently have Cull Back. If you want the bubble to look "hollow" 
        // when sliced open by the cut plane, change this to "Cull Off" like your first shader.
        Cull Back

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing // Insert for GPU instancing
            #pragma shader_feature DEBRIS

            #include "UnityCG.cginc"
            #include "Assets/VivifyTemplate/Utilities/Shader Functions/Noise.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;

                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float3 normal : TEXCOORD0;
                float3 viewDir : TEXCOORD1;
                float3 localPos : TEXCOORD2; // Added to calculate world noise and cut planes

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
            float4 _BaseColor;
            float _FresnelPower;
            float _Intensity;
            float _Alpha;
            float _CutoutEdgeWidth;

            v2f vert (appdata v)
            {
                v2f o;

                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_TRANSFER_INSTANCE_ID(v, o);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.pos = UnityObjectToClipPos(v.vertex);
                o.localPos = v.vertex; // Store local position for the cut calculations

                float3 worldPos = mul(unity_ObjectToWorld, v.vertex).xyz;
                o.normal = UnityObjectToWorldNormal(v.normal);
                o.viewDir = normalize(_WorldSpaceCameraPos - worldPos);

                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                UNITY_SETUP_INSTANCE_ID(i);

                // --- DEBRIS & CUTOUT LOGIC ---
                float Cutout = UNITY_ACCESS_INSTANCED_PROP(Props, _Cutout);
                float4 CutPlane = UNITY_ACCESS_INSTANCED_PROP(Props, _CutPlane);
                
                float c = 0;

                #if DEBRIS
                    float3 samplePoint = i.localPos + CutPlane.xyz * CutPlane.w;
                    float planeDistance = dot(samplePoint, CutPlane.xyz) / length(CutPlane.xyz);
                    c = planeDistance - Cutout * 0.25;
                #else
                    float noise = simplex(i.localPos * 2);
                    c = noise - Cutout;
                #endif

                // Discard the pixel if it is dissolved or sliced away
                clip(c);

                // Edge glowing effect on the cut border
                if (c < _CutoutEdgeWidth) {
                    return fixed4(1, 1, 1, 1); // Opaque white cut edge
                }
                // -----------------------------

                // --- BUBBLE LOGIC ---
                float4 FresnelColor = UNITY_ACCESS_INSTANCED_PROP(Props, _Color);
                float3 N = normalize(i.normal);
                float3 V = normalize(i.viewDir);

                float fresnel = pow(1.0 - saturate(dot(N, V)), _FresnelPower);

                float3 col = _BaseColor.rgb;
                col += fresnel * FresnelColor.rgb;

                col *= _Intensity;

                return float4(col, _Alpha); // LOW alpha = no bloom blowout
            }
            ENDCG
        }
    }
}