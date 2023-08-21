import React, { useEffect, useState } from 'react';
import { VideoResultInformation } from '@/types/youtube';
import FoodContentCard from '@/components/FoodContentCard';
import styled from '@emotion/styled';
import {
  OrderingType,
  getYoutubeFromIngredient
} from '@/apis/search/getYoutubeFromIngredient';
import Chip from '@/components/common/Chip';
import ArrowUpIcon from '@/public/svg/arrow-up.svg';
import Autocomplete from '@/components/Search/SearchInput/Autocomplete';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import viewsFormatter from '@/utils/viewsFormatter';
import timeFormatter from '@/utils/timeFormatter';
import { showModal } from '@/provider/ModalState';
import YoutubeModalBody from '@/components/YoutubeModalBody';
import { useRouter } from 'next/router';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import Loading from '@/components/common/Loading';

const ResultPage = ({
  ingredients
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  //   Filter

  // 최신순, 조회순
  const FILTER_OPTION: { [key: string]: OrderingType } = {
    최신순: 'published',
    조회순: 'view_count'
  };
  const [filterOption, setFilterOption] = useState<OrderingType>('view_count');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const router = useRouter();
  const ingredientsQuery = router.query.ingredients ?? [];
  let ingredientsArray: string[];
  if (typeof ingredientsQuery === 'string') {
    ingredientsArray = ingredientsQuery.split(',');
  } else if (Array.isArray(ingredientsQuery)) {
    ingredientsArray = ingredientsQuery.flatMap((item) => item.split(','));
  } else {
    ingredientsArray = [];
  }

  const { data: videoInformation, refetch } = useQuery(
    ['getYoutubeFromIngredient', filterOption],
    () => getYoutubeFromIngredient(filterOption, ingredients),
    {
      enabled: false
    }
  );

  useEffect(() => {
    refetch();
  }, [filterOption]);

  if (!videoInformation) return <Loading />;

  return (
    <ResultPageContainer>
      <TitleWrapper>
        <ContentTitle>
          <CategoryTitle>&apos;{ingredients}&apos; 레시피</CategoryTitle>
          <Chip count={videoInformation.length} />
        </ContentTitle>
        <OptionWrapper>
          <FilterOption
            onClick={() => {
              setIsFilterOpen((prev) => !prev);
            }}
          >
            <ArrowIcon isOpen={isFilterOpen} />
            <FilterSpan>{FILTER_OPTION[filterOption]}</FilterSpan>
          </FilterOption>
          <Autocomplete
            keywords={['최신순', '조회순']}
            isOpen={isFilterOpen}
            onItemClick={(item) => {
              setFilterOption(FILTER_OPTION[item] as OrderingType);
              setIsFilterOpen(false);
            }}
          />
        </OptionWrapper>
      </TitleWrapper>
      <VideoContainer>
        {videoInformation.map((resultVideoInfo: VideoResultInformation) => {
          const video = resultVideoInfo.video;
          const creator = resultVideoInfo.creator;
          const ingredientCount =
            resultVideoInfo.ingredients.length -
            resultVideoInfo.ingredients.filter((item) =>
              ingredientsArray.includes(item)
            ).length;
          const handleModalClick = () => {
            showModal({
              fullScreen: true,
              show: true,
              body: (
                <YoutubeModalBody
                  id={video.id}
                  haveIngredients={ingredientsArray}
                />
              ),
              onClose: () => {
                router.push(router.asPath, router.asPath, {
                  shallow: true
                });
              }
            });
            router.push(router.asPath, `/youtube/${video.id}`, {
              shallow: true
            });
          };
          return (
            <FoodContentCard.Layout key={video.id}>
              <div onClick={handleModalClick}>
                <ImageWrapper>
                  <ImageScaleUp>
                    <FoodContentCard.Thumbnail
                      src={video.thumbnailURL}
                      size="md"
                    />
                  </ImageScaleUp>
                </ImageWrapper>
                <FoodContentCard.Body
                  title={video.title}
                  ingredientCount={ingredientCount}
                />
              </div>
              <FoodContentCard.Footer
                src={creator.thumbnail}
                viewAndDates={`조회수 ${viewsFormatter(
                  video.views
                )}회 • ${timeFormatter(video.createdAt)}전`}
              >
                {creator.name}
              </FoodContentCard.Footer>
            </FoodContentCard.Layout>
          );
        })}
      </VideoContainer>
    </ResultPageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const ingredients = query.ingredients as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['getYoutubeFromIngredient'], () =>
    getYoutubeFromIngredient('view_count', ingredients.split(','))
  );

  return {
    props: {
      ingredients: ingredients.split(','),
      dehydratedState: dehydrate(queryClient)
    }
  };
};

export default ResultPage;

const ResultPageContainer = styled.div`
  max-width: 80rem;
  margin: auto;

  width: 100%;
  padding: 0;

  ${({ theme }) => theme.screen.desktop} {
    padding: 0 1.25rem;
    width: auto;
    .swiper-wrapper {
      margin-left: 0;
    }
  }
`;

const ImageWrapper = styled.div`
  overflow: hidden;
`;

const ImageScaleUp = styled.div`
  transform: scale(1);
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.2);
  }
`;

const TitleWrapper = styled.div`
  padding: 1.5rem 1.25rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => theme.screen.desktop} {
    padding: 3rem 0 2rem;
  }
`;

const ContentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.88rem;
  flex: 1;
`;

const CategoryTitle = styled.h2`
  color: ${({ theme }) => theme.colors.yellow[400]};
  ${({ theme }) => theme.font.title.sm};

  ${({ theme }) => theme.screen.desktop} {
    ${({ theme }) => theme.font.headLine.md};
  }
`;

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  padding: 0 1.25rem;
  gap: 1.5rem;

  ${({ theme }) => theme.screen.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.screen.desktop} {
    grid-template-columns: repeat(4, 1fr);
    padding: 0;
  }
`;

const OptionWrapper = styled.div`
  position: relative;
  width: 4.75rem;
`;

const FilterOption = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const FilterSpan = styled.span`
  ${({ theme }) => theme.font.body.md};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray[300]};
  align-self: flex-end;
`;

const ArrowIcon = styled(ArrowUpIcon)<{ isOpen: boolean }>`
  transform: ${({ isOpen }) => (isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
  transition: transform 0.3s ease-in-out;
`;
