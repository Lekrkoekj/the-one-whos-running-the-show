Shader "Custom/SolidColor"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
    }

    SubShader
    {
        Tags { "Queue"="Transparent"
            "RenderType"="Transparent" 
        }
        LOD 100

        Pass
        {
            Blend SrcAlpha OneMinusSrcAlpha

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            // Include basic Unity shader helpers
            #include "UnityCG.cginc"

            // Vertex input
            struct appdata
            {
                float4 vertex : POSITION;

                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            // Data passed to fragment shader
            struct v2f
            {
                float4 pos : SV_POSITION;

                UNITY_VERTEX_OUTPUT_STEREO
            };

            // Color property
            fixed4 _Color;

            // Vertex shader
            v2f vert (appdata v)
            {
                v2f o;

                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);
                o.pos = UnityObjectToClipPos(v.vertex);
                return o;
            }

            // Fragment shader
            fixed4 frag (v2f i) : SV_Target
            {
                return _Color;
            }

            ENDCG
        }
    }
}