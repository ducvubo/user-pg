'use client'

import type { NextPage } from 'next';
import Link from 'next/link';

const Page404: NextPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
        }}
      >
        <h1
          style={{
            fontSize: '6rem',
            margin: '0',
            color: '#ff6b6b',
            fontWeight: 800,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: '1.5rem',
            color: '#333',
            margin: '1rem 0',
          }}
        >
          Oops! Trang không tìm thấy
        </h2>
        <p
          style={{
            color: '#666',
            margin: '1rem 0 2rem',
            lineHeight: 1.5,
          }}
        >
          Có vẻ như bạn đã đi lạc. Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/" passHref>
          <button
            style={{
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              backgroundColor: '#4facfe',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00f2fe';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4facfe';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Về trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Page404;