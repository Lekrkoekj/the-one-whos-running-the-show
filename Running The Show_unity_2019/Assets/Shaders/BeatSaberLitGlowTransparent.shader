Shader "BeatSaber/Lit Glow Transparent"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _Tex ("Texture", 2D) = "white" {}
        _Glow ("Glow (Bloom Alpha)", Range (0, 1)) = 0
        _Opacity ("Opacity", Range (0, 1)) = 1
        _Ambient ("Ambient Lighting", Range (0, 1)) = 0
        _LightDir ("Light Direction", Vector) = (-1,-1,0,1)
    }
    SubShader
    {
        Tags 
        { 
            "RenderType"="Transparent"
            "Queue"="Transparent"
        }
        LOD 100

        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_fog
            
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                float3 normal : NORMAL;

                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
                float4 worldPos : TEXCOORD1;
                float3 viewDir : TEXCOORD2;
                float3 normal : NORMAL;
                
                UNITY_VERTEX_OUTPUT_STEREO
            };

            float4 _Color;
            float _Glow;
            float _Opacity;
            float _Ambient;
            float4 _LightDir;

            sampler2D _Tex;
            float4 _Tex_ST;
            
            v2f vert (appdata v)
            {
                v2f o;

                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);
                
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                o.worldPos = mul(unity_ObjectToWorld, v.vertex);
                o.viewDir = normalize(UnityWorldSpaceViewDir(o.worldPos));
                o.normal = UnityObjectToWorldNormal(v.normal);
                return o;
            }
            
            fixed4 frag (v2f i) : SV_Target
            {
                float3 lightDir = normalize(_LightDir.xyz) * -1.0;
                float shadow = max(dot(lightDir,i.normal),0);

                fixed4 col = _Color * tex2D(_Tex, TRANSFORM_TEX(i.uv, _Tex));
                col.rgb *= clamp(col.rgb * _Ambient + shadow,0.0,1.0);

                // Apply opacity separately from bloom
                float finalAlpha = _Opacity;

                // Keep glow value in alpha for bloom
                return float4(col.rgb, finalAlpha) * float4(1,1,1,_Glow);
            }
            ENDCG
        }
    }
}