import Head from 'next/head';
import BannerCarousel from '@/components/Carousel/Banner/BannerCarousel';
import CardCarousel from '@/components/Carousel/Card/CardCarouselContainer';
import styled from '@emotion/styled';

import { SAMPLE_BANNER_DATA, SAMPLE_CARD_DATA } from '@/constants';

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* NOTE: 이 부분은 따로 component로 빼도 될거 같기는 한데, 우선 Server Side Props 로 받아오면 
                어떻게 보일지를 몰라서, 나중에 변경 예정
      */}
      <MainContainer>
        <BannerCarousel contents={SAMPLE_BANNER_DATA} />
        <CardCarousel
          title={'헬스 하는 사람들을 위한 음식'}
          contents={SAMPLE_CARD_DATA}
        />
        <CardCarousel
          title={'헬스 하는 사람들을 위한 음식'}
          contents={SAMPLE_CARD_DATA}
        />
        <CardCarousel
          title={'헬스 하는 사람들을 위한 음식'}
          contents={SAMPLE_CARD_DATA}
        />
      </MainContainer>
    </>
  );
}

const MainContainer = styled.div`
  padding: 2rem 0;

  display: flex;
  flex-direction: column;
  gap: 4rem;

  background-color: #000;
`;
