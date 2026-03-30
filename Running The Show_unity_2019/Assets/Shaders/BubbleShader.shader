Shader "Custom/BeatSaberBubble_AlphaSafe"
{
    Properties
    {
        _BaseColor ("Base Color", Color) = (0.2, 0.5, 1, 0.05)
        _Color ("Fresnel Color", Color) = (1, 1, 1, 0.05)
        _FresnelPower ("Fresnel Power", float) = 5
        _Intensity ("Intensity", float) = 0.6
        _Alpha ("Alpha (Bloom Control)", Range(0, 1)) = 0.05
    }

    SubShader
    {
        Tags { "Queue"="Transparent" "RenderType"="Transparent" }

        Blend SrcAlpha OneMinusSrcAlpha   // IMPORTANT: not additive
        ZWrite Off
        Cull Back

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

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

                UNITY_VERTEX_OUTPUT_STEREO
            };

            float4 _BaseColor;
            float4 _Color;
            float _FresnelPower;
            float _Intensity;
            float _Alpha;

            v2f vert (appdata v)
            {
                v2f o;

                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.pos = UnityObjectToClipPos(v.vertex);

                float3 worldPos = mul(unity_ObjectToWorld, v.vertex).xyz;
                o.normal = UnityObjectToWorldNormal(v.normal);
                o.viewDir = normalize(_WorldSpaceCameraPos - worldPos);

                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                float3 N = normalize(i.normal);
                float3 V = normalize(i.viewDir);

                float fresnel = pow(1.0 - saturate(dot(N, V)), _FresnelPower);

                float3 col = _BaseColor.rgb;
                col += fresnel * _Color.rgb;

                col *= _Intensity;

                return float4(col, _Alpha); // LOW alpha = no bloom blowout
            }
            ENDCG
        }
    }
}